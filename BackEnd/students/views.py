from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from .models import Student
from .serializers import *
from shared.utils import generate_jwt_token, success_response, error_response
from shared.decorators import require_auth

@api_view(['POST'])
@permission_classes([AllowAny])
def register_student(request):
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        student = serializer.save()
        return success_response('REGISTRATION_SUCCESS', {
            "student_id": student.id,
            "college_id": student.college_id
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login_student(request):
#     serializer = StudentLoginSerializer(data=request.data)
#     if not serializer.is_valid():
#         return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
#     email = serializer.validated_data['email']
#     password = serializer.validated_data['password']
    
#     try:
#         student = Student.objects.get(email=email)
        
#         if not check_password(password, student.password):
#             return error_response('INVALID_CREDENTIALS')
        
#         if not student.is_active:
#             return error_response('ACCOUNT_INACTIVE', status.HTTP_403_FORBIDDEN)
        
#         if student.approval_status == 'pending':
#             return error_response('REGISTRATION_PENDING', status.HTTP_403_FORBIDDEN)
#         elif student.approval_status == 'rejected':
#             return error_response('REGISTRATION_REJECTED', status.HTTP_403_FORBIDDEN)
#         elif not student.can_login():
#             return error_response('ACADEMIC_YEAR_EXPIRED', status.HTTP_403_FORBIDDEN)
        
#         token = generate_jwt_token(student, 'student')
        
#         return success_response('LOGIN_SUCCESS', {
#             "token": token,
#             "student": {
#                 "id": student.id,
#                 "name": student.name,
#                 "email": student.email,
#                 "college_id": student.college_id,
#                 "department": student.department_id,
#                 "course": student.course_id,
#                 "academic_year_active": student.is_academic_year_active()
#             }
#         })
        
#     except Student.DoesNotExist:
#         return error_response('INVALID_CREDENTIALS')

@api_view(['GET'])
@require_auth('teacher', allow_admin=True)
def get_pending_students(request):
    if request.user_type != 'admin' and request.user.role not in ['hod', 'principal']:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    if request.user_type != 'admin' and request.user.role == 'hod':
        students = Student.objects.select_related('department', 'course').filter(approval_status='pending', department_id=request.user.department_id)
    else:
        students = Student.objects.select_related('department', 'course').filter(approval_status='pending')
    
    students_data = []
    for student in students:
        students_data.append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "phone_number": student.phone_number,
            "address": student.address,
            "college_id": student.college_id,
            "department_id": student.department_id,
            "department_name": student.department.name,
            "course_id": student.course_id,
            "course_name": student.course.name,
            "approval_status": student.approval_status,
            "created_at": student.created_at
        })
    
    return success_response('', {"students": students_data})

@api_view(['PUT'])
@require_auth('teacher', allow_admin=True)
def approve_student(request, student_id):
    if request.user.role not in ['hod', 'principal', 'admin']:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return error_response('USER_NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    if request.user.role == 'hod' and student.department_id != request.user.department_id:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    action = request.data.get('action')
    
    if action == 'approve':
        academic_year_start = request.data.get('academic_year_start')
        academic_year_end = request.data.get('academic_year_end')
        
        if not academic_year_start or not academic_year_end:
            return error_response("Academic year dates are required")
        
        student.approval_status = 'approved'
        student.academic_year_start = academic_year_start
        student.academic_year_end = academic_year_end
        student.approved_at = timezone.now()
        student.save()
        
        return success_response('APPROVAL_SUCCESS')
    
    elif action == 'reject':
        student.approval_status = 'rejected'
        student.save()
        return success_response('REJECTION_SUCCESS')
    
    else:
        return error_response("Invalid action")

@api_view(['GET'])
@require_auth('teacher', allow_admin=True)
def get_approved_students(request):
    if request.user_type != 'admin' and request.user.role not in ['tutor', 'hod', 'principal']:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    if request.user_type != 'admin' and request.user.role == 'hod':
        students = Student.objects.select_related('department', 'course').filter(approval_status='approved', department_id=request.user.department_id)
    elif request.user_type != 'admin' and request.user.role == 'tutor':
        students = Student.objects.select_related('department', 'course').filter(approval_status='approved', course_id=request.user.course_id)
    else:
        students = Student.objects.select_related('department', 'course').filter(approval_status='approved')
    
    students_data = []
    for student in students:
        students_data.append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "college_id": student.college_id,
            "department_id": student.department_id,
            "department_name": student.department.name,
            "course_id": student.course_id,
            "course_name": student.course.name,
            "approval_status": student.approval_status,
            "approved_at": student.approved_at,
            "academic_year_start": student.academic_year_start,
            "academic_year_end": student.academic_year_end
        })
    
    return success_response('', {"students": students_data})

@api_view(['GET'])
@require_auth('student')
def student_profile(request):
    student = request.user
    return success_response('', {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "phone_number": student.phone_number,
        "address": student.address,
        "college_id": student.college_id,
        "department_id": student.department_id,
        "department_name": student.department.name,
        "course_id": student.course_id,
        "course_name": student.course.name,
        "academic_year_start": student.academic_year_start,
        "academic_year_end": student.academic_year_end,
        "academic_year_active": student.is_academic_year_active()
    })