from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
from students.models import Student
from teachers.models import Teacher
from adminpanel.models import AdminUser
from .utils import generate_jwt_token, success_response, error_response

@api_view(['POST'])
@permission_classes([AllowAny])
def common_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return error_response('Email and password are required')
    
    # Try to find user in each model
    user = None
    user_type = None
    
    # Check Student
    try:
        user = Student.objects.get(email=email)
        user_type = 'student'
        role = 'student'
    except Student.DoesNotExist:
        pass
    
    # Check Teacher
    if not user:
        try:
            user = Teacher.objects.get(email=email)
            user_type = 'teacher'
            role = user.role
        except Teacher.DoesNotExist:
            pass
    
    # Check Admin
    if not user:
        try:
            user = AdminUser.objects.get(email=email)
            user_type = 'admin'
            role = 'admin'
        except AdminUser.DoesNotExist:
            pass
    
    if not user:
        return error_response('INVALID_CREDENTIALS')
    
    # Verify password
    if not check_password(password, user.password):
        return error_response('INVALID_CREDENTIALS')
    
    # Check if account is active
    if hasattr(user, 'is_active') and not user.is_active:
        return error_response('ACCOUNT_INACTIVE', status.HTTP_403_FORBIDDEN)
    
    # Student-specific checks
    if user_type == 'student':
        if user.approval_status == 'pending':
            return error_response('REGISTRATION_PENDING', status.HTTP_403_FORBIDDEN)
        elif user.approval_status == 'rejected':
            return error_response('REGISTRATION_REJECTED', status.HTTP_403_FORBIDDEN)
        elif not user.can_login():
            return error_response('ACADEMIC_YEAR_EXPIRED', status.HTTP_403_FORBIDDEN)
    
    # Generate token
    token = generate_jwt_token(user, user_type)
    
    # Prepare user data based on type
    if user_type == 'student':
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "college_id": user.college_id,
            "department": user.department_id,
            "course": user.course_id,
            "academic_year_active": user.is_academic_year_active()
        }
    elif user_type == 'teacher':
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "employee_id": user.employee_id,
            "role": user.role,
            "department": user.department_id,
            "course": user.course_id if user.course_id else None
        }
    else:  # admin
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_superuser": user.is_superuser
        }
    
    return success_response('LOGIN_SUCCESS', {
        "token": token,
        "user_type": user_type,
        "user_role": role,
        "user": user_data
    })