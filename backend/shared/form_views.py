from rest_framework.decorators import api_view
from rest_framework import status
from django.utils import timezone
from django.db import models
from .form_models import CustomForm, FormSubmission
from teachers.models import Teacher
from .form_serializers import *
from .utils import success_response, error_response
from .decorators import require_auth

@api_view(['GET'])
def list_forms(request):
    department_id = request.GET.get('department_id')
    
    # Get user info from token if authenticated
    auth_header = request.headers.get('Authorization')
    user_type = None
    user = None
    
    if auth_header and auth_header.startswith('Bearer '):
        from .utils import verify_jwt_token, get_user_from_token
        token = auth_header.split(' ')[1]
        payload = verify_jwt_token(token)
        if payload:
            user_type = payload.get('user_type')
            if user_type == 'teacher':
                user = get_user_from_token(token, 'teacher')
            elif user_type == 'student':
                user = get_user_from_token(token, 'student')
    
    # Filter forms based on user type
    if user_type == 'teacher' and user and user.role in ['hod', 'tutor']:
        # HOD/Tutor can only see their department forms and common forms
        forms = CustomForm.objects.filter(
            is_active=True
        ).filter(
            models.Q(department_id=user.department_id) | models.Q(department__isnull=True)
        )
    elif user_type == 'student' and user:
        # Students can only see their department forms and common forms
        forms = CustomForm.objects.filter(
            is_active=True
        ).filter(
            models.Q(department_id=user.department_id) | models.Q(department__isnull=True)
        )
    elif department_id:
        forms = CustomForm.objects.filter(is_active=True, department_id=department_id)
    else:
        forms = CustomForm.objects.filter(is_active=True)
    
    serializer = CustomFormSerializer(forms, many=True)
    return success_response('', {"forms": serializer.data})

@api_view(['GET'])
def get_form(request, form_id):
    try:
        form = CustomForm.objects.get(id=form_id, is_active=True)
    except CustomForm.DoesNotExist:
        return error_response('Form not found', status.HTTP_404_NOT_FOUND)
    
    serializer = CustomFormSerializer(form)
    return success_response('', {"form": serializer.data})

@api_view(['POST'])
@require_auth('teacher', allow_admin=True)
def create_form(request):
    if request.user_type == 'admin':
        created_by_type = 'admin'
        created_by_id = 1
    elif request.user.role in ['principal', 'hod']:
        created_by_type = request.user.role
        created_by_id = request.user.id
        
        # HOD can only create forms for their department
        if request.user.role == 'hod':
            department_id = request.data.get('department')
            if department_id and str(department_id) != str(request.user.department_id):
                return error_response('HOD can only create forms for their own department', status.HTTP_403_FORBIDDEN)
    else:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    serializer = FormCreateSerializer(data=request.data)
    if serializer.is_valid():
        form = serializer.save(
            created_by_type=created_by_type,
            created_by_id=created_by_id
        )
        return success_response('Form created successfully', {
            "form_id": form.id,
            "title": form.title
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['POST'])
@require_auth('student')
def submit_form(request, form_id):
    try:
        form = CustomForm.objects.get(id=form_id, is_active=True)
    except CustomForm.DoesNotExist:
        return error_response('Form not found', status.HTTP_404_NOT_FOUND)
    
    # Validate form data against form fields
    form_data = request.data.get('data', {})
    for field in form.fields.all():
        if field.is_required and not form_data.get(field.label):
            return error_response(f"Field '{field.label}' is required")
    
    serializer = FormSubmissionCreateSerializer(data=request.data)
    if serializer.is_valid():
        submission = serializer.save(student=request.user)
        return success_response('Form submitted successfully', {
            "submission_id": submission.id
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['GET'])
@require_auth('student')
def my_submissions(request):
    submissions = FormSubmission.objects.filter(student=request.user).order_by('-submitted_at')
    serializer = FormSubmissionSerializer(submissions, many=True)
    return success_response('', {"submissions": serializer.data})

@api_view(['GET'])
@require_auth('teacher', allow_admin=True)
def list_submissions(request):
    form_id = request.GET.get('form_id')
    status_filter = request.GET.get('status')
    
    submissions = FormSubmission.objects.all()
    
    if form_id:
        submissions = submissions.filter(form_id=form_id)
    
    if status_filter:
        submissions = submissions.filter(status=status_filter)
    
    # Filter based on user role
    if request.user.role == 'tutor':
        # Tutor sees submissions for their course
        submissions = submissions.filter(
            student__course_id=request.user.course_id,
        )
    elif request.user.role == 'hod':
        # HOD sees submissions for their department
        submissions = submissions.filter(
            student__department_id=request.user.department_id,
        )
    
    submissions = submissions.order_by('-submitted_at')
    serializer = FormSubmissionSerializer(submissions, many=True)
    return success_response('', {"submissions": serializer.data})

@api_view(['PUT'])
@require_auth('teacher')
def review_submission(request, submission_id):
    try:
        submission = FormSubmission.objects.get(id=submission_id)
    except FormSubmission.DoesNotExist:
        return error_response('Submission not found', status.HTTP_404_NOT_FOUND)
    
    action = request.data.get('action')  # 'approve' or 'reject'
    comments = request.data.get('comments', '')
    
    if action not in ['approve', 'reject']:
        return error_response('Invalid action. Use approve or reject')
    
    # Get student's course tutor, department HOD, and principal
    tutor = hod = principal = None
    
    if submission.status == 'pending_tutor':
        try:
            tutor = Teacher.objects.get(role='tutor', course_id=submission.student.course_id)
        except Teacher.DoesNotExist:
            return error_response('Course tutor not found')
    elif submission.status == 'pending_hod':
        try:
            hod = Teacher.objects.get(role='hod', department_id=submission.student.department_id)
        except Teacher.DoesNotExist:
            return error_response('Department HOD not found')
    elif submission.status == 'pending_principal':
        try:
            principal = Teacher.objects.filter(role='principal').first()
            if not principal:
                return error_response('Principal not found')
        except Teacher.DoesNotExist:
            return error_response('Principal not found')
    
    current_time = timezone.now()
    
    # Tutor approval
    if submission.status == 'pending_tutor':
        if request.user.id != tutor.id:
            return error_response('Only assigned tutor can review at this stage', status.HTTP_403_FORBIDDEN)
        
        submission.tutor_reviewed_by = request.user
        submission.tutor_reviewed_at = current_time
        submission.tutor_comments = comments
        
        if action == 'approve':
            submission.status = 'pending_hod'
        else:
            submission.status = 'rejected'
    
    # HOD approval
    elif submission.status == 'pending_hod':
        if request.user.id != hod.id:
            return error_response('Only assigned HOD can review at this stage', status.HTTP_403_FORBIDDEN)
        
        submission.hod_reviewed_by = request.user
        submission.hod_reviewed_at = current_time
        submission.hod_comments = comments
        
        if action == 'approve':
            submission.status = 'pending_principal'
        else:
            submission.status = 'rejected'
    
    # Principal approval
    elif submission.status == 'pending_principal':
        if request.user.id != principal.id:
            return error_response('Only principal can review at this stage', status.HTTP_403_FORBIDDEN)
        
        submission.principal_reviewed_by = request.user
        submission.principal_reviewed_at = current_time
        submission.principal_comments = comments
        
        if action == 'approve':
            submission.status = 'approved'
        else:
            submission.status = 'rejected'
    
    else:
        return error_response('Submission cannot be reviewed at current status')
    
    submission.save()
    return success_response(f'Submission {action}d successfully')

def can_manage_form(user_type, user, form):
    """Check if user can manage (update/delete) the form based on hierarchy"""
    if user_type == 'admin':
        return True
    
    if form.created_by_type == 'admin':
        return user_type == 'admin'
    elif form.created_by_type == 'principal':
        return user_type == 'admin' or (user_type == 'teacher' and user.role == 'principal' and user.id == form.created_by_id)
    elif form.created_by_type == 'hod':
        return (user_type == 'admin' or 
                (user_type == 'teacher' and user.role == 'principal') or
                (user_type == 'teacher' and user.role == 'hod' and user.id == form.created_by_id))
    
    return False

@api_view(['PUT'])
@require_auth('teacher', allow_admin=True)
def update_form(request, form_id):
    try:
        form = CustomForm.objects.get(id=form_id)
    except CustomForm.DoesNotExist:
        return error_response('Form not found', status.HTTP_404_NOT_FOUND)
    
    if not can_manage_form(request.user_type, request.user, form):
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    if 'title' in request.data:
        form.title = request.data['title']
    if 'description' in request.data:
        form.description = request.data['description']
    if 'is_active' in request.data:
        form.is_active = request.data['is_active']
    
    form.save()
    return success_response('Form updated successfully')

@api_view(['DELETE'])
@require_auth('teacher', allow_admin=True)
def delete_form(request, form_id):
    try:
        form = CustomForm.objects.get(id=form_id)
    except CustomForm.DoesNotExist:
        return error_response('Form not found', status.HTTP_404_NOT_FOUND)
    
    if not can_manage_form(request.user_type, request.user, form):
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    form.delete()
    return success_response('Form deleted successfully')