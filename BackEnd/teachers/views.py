from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Teacher
from .serializers import *
from shared.utils import generate_jwt_token, success_response, error_response, get_user_from_token
from shared.decorators import require_admin, require_auth

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def teacher_login(request):
#     serializer = TeacherLoginSerializer(data=request.data)
#     if not serializer.is_valid():
#         return error_response(serializer.errors)
    
#     email = serializer.validated_data['email']
#     password = serializer.validated_data['password']
    
#     try:
#         teacher = Teacher.objects.get(email=email, is_active=True)
        
#         if not check_password(password, teacher.password):
#             return error_response('INVALID_CREDENTIALS')
        
#         token = generate_jwt_token(teacher, 'teacher')
        
#         return success_response('LOGIN_SUCCESS', {
#             "token": token,
#             "teacher": {
#                 "id": teacher.id,
#                 "name": teacher.name,
#                 "email": teacher.email,
#                 "employee_id": teacher.employee_id,
#                 "role": teacher.role,
#                 "department": teacher.department
#             }
#         })
        
#     except Teacher.DoesNotExist:
#         return error_response('INVALID_CREDENTIALS')

@api_view(['POST'])
@require_auth('teacher', allow_admin=True)
def create_teacher(request):
    serializer = TeacherCreateSerializer(data=request.data)
    if serializer.is_valid():
        teacher = serializer.save()
        return success_response('USER_CREATED', {
            "teacher_id": teacher.id,
            "employee_id": teacher.employee_id
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['GET'])
@require_auth('teacher', allow_admin=True)
def list_teachers(request):
    if request.user_type == 'admin':
        teachers = Teacher.objects.select_related('department', 'course').all()
    elif request.user.role == 'principal':
        teachers = Teacher.objects.select_related('department', 'course').filter(role__in=['hod', 'tutor'])
    elif request.user.role == 'hod':
        teachers = Teacher.objects.select_related('department', 'course').filter(role='tutor', department_id=request.user.department_id)
    else:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    teachers_data = []
    for teacher in teachers:
        teachers_data.append({
            "id": teacher.id,
            "name": teacher.name,
            "email": teacher.email,
            "employee_id": teacher.employee_id,
            "role": teacher.role,
            "department_id": teacher.department_id,
            "department_name": teacher.department.name if teacher.department else None,
            "course_id": teacher.course_id,
            "course_name": teacher.course.name if teacher.course else None,
            "is_active": teacher.is_active,
            "created_at": teacher.created_at
        })
    
    return success_response('', {"teachers": teachers_data})

@api_view(['PUT'])
@require_auth('admin', allow_admin=True)
def update_teacher(request, teacher_id):
    try:
        target_teacher = Teacher.objects.get(id=teacher_id)
    except Teacher.DoesNotExist:
        return error_response('USER_NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    if request.user_type != 'admin' and not request.user.can_manage_user(target_teacher):
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    serializer = TeacherUpdateSerializer(target_teacher, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return success_response('USER_UPDATED')
    return error_response(serializer.errors)

@api_view(['DELETE'])
@require_auth('teacher', allow_admin=True)
def deactivate_teacher(request, teacher_id):
    try:
        target_teacher = Teacher.objects.get(id=teacher_id)
    except Teacher.DoesNotExist:
        return error_response('USER_NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    if request.user_type != 'admin' and not request.user.can_manage_user(target_teacher):
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    target_teacher.is_active = False
    target_teacher.save()
    return success_response('USER_DEACTIVATED')

@api_view(['GET'])
@require_auth('teacher')
def teacher_profile(request):
    teacher = request.user
    return success_response('', {
        "id": teacher.id,
        "name": teacher.name,
        "email": teacher.email,
        "phone_number": teacher.phone_number,
        "employee_id": teacher.employee_id,
        "role": teacher.role,
        "department_id": teacher.department_id,
        "department_name": teacher.department.name if teacher.department else None,
        "course_id": teacher.course_id,
        "course_name": teacher.course.name if teacher.course else None,
        "is_active": teacher.is_active
    })

@api_view(['GET'])
@require_auth('teacher', allow_admin=True)
def get_teacher_details(request, teacher_id):
    try:
        teacher = Teacher.objects.get(id=teacher_id)
    except Teacher.DoesNotExist:
        return error_response('USER_NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    return success_response('', {
        "id": teacher.id,
        "name": teacher.name,
        "email": teacher.email,
        "phone_number": teacher.phone_number,
        "employee_id": teacher.employee_id,
        "role": teacher.role,
        "department_id": teacher.department_id,
        "department_name": teacher.department.name if teacher.department else None,
        "course_id": teacher.course_id,
        "course_name": teacher.course.name if teacher.course else None,
        "is_active": teacher.is_active,
        "created_at": teacher.created_at,
        "updated_at": teacher.updated_at
    })