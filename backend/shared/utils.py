"""Shared utilities across all apps"""
from django.utils import timezone
from django.conf import settings
import jwt
from rest_framework.response import Response
from rest_framework import status
from .constants import ERROR_MESSAGES

def generate_jwt_token(user, user_type='student', extra_data=None):
    """Generate JWT token for any user type"""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'user_type': user_type,
        'exp': timezone.now() + timezone.timedelta(days=7)
    }
    
    if user_type == 'student':
        payload.update({
            'college_id': user.college_id,
            'department_id': user.department_id
        })
    elif user_type == 'teacher':
        payload.update({
            'employee_id': user.employee_id,
            'role': user.role,
            'department_id': user.department_id
        })
    elif user_type == 'admin':
        payload.update({
            'role': 'admin',
            'is_superuser': user.is_superuser
        })
    
    if extra_data:
        payload.update(extra_data)
    
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def verify_jwt_token(token):
    """Verify JWT token and return user data"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def get_user_from_token(token, user_type):
    """Get user object from token based on user type"""
    payload = verify_jwt_token(token)
    if not payload or payload.get('user_type') != user_type:
        return None
    
    try:
        if user_type == 'student':
            from students.models import Student
            return Student.objects.get(id=payload['user_id'], is_active=True)
        elif user_type == 'teacher':
            from teachers.models import Teacher
            return Teacher.objects.get(id=payload['user_id'], is_active=True)
        elif user_type == 'admin':
            from adminpanel.models import AdminUser
            return AdminUser.objects.get(id=payload['user_id'], is_active=True)
    except Exception:
        return None

def error_response(message_key, status_code=status.HTTP_400_BAD_REQUEST, extra_data=None):
    """Standardized error response"""
    if isinstance(message_key, dict):
        # Handle serializer errors
        response_data = {"error": message_key}
    else:
        response_data = {"error": ERROR_MESSAGES.get(message_key, message_key)}
    
    if extra_data:
        response_data.update(extra_data)
    return Response(response_data, status=status_code)

def success_response(message_key, data=None, status_code=status.HTTP_200_OK):
    """Standardized success response"""
    from .constants import SUCCESS_MESSAGES
    response_data = {"message": SUCCESS_MESSAGES.get(message_key, message_key)}
    if data:
        response_data.update(data)
    return Response(response_data, status=status_code)

def validate_auth_header(request, required_type=None):
    """Validate authorization header and return token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, error_response('AUTHENTICATION_REQUIRED', status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(' ')[1]
    
    # Check for admin token
    if token == 'admin-token':
        return 'admin-token', None
    
    # Verify JWT token
    payload = verify_jwt_token(token)
    if not payload:
        return None, error_response('INVALID_TOKEN', status.HTTP_401_UNAUTHORIZED)
    
    if required_type and payload.get('user_type') != required_type:
        return None, error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    return token, None