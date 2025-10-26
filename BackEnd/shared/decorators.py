"""Shared decorators for authentication and authorization"""
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .utils import validate_auth_header, get_user_from_token, error_response

def require_auth(user_type=None, allow_admin=False):
    """Decorator to require authentication"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return error_response('AUTHENTICATION_REQUIRED', status.HTTP_401_UNAUTHORIZED)
            
            token = auth_header.split(' ')[1]
            
            # Check for admin access first if allowed
            if allow_admin:
                # Check hardcoded admin token
                if token == 'admin-token':
                    request.user = None
                    request.user_type = 'admin'
                    return view_func(request, *args, **kwargs)
                
                # Check JWT admin token
                admin_user = get_user_from_token(token, 'admin')
                if admin_user:
                    request.user = admin_user
                    request.user_type = 'admin'
                    return view_func(request, *args, **kwargs)
            
            # Regular user access
            if user_type:
                user = get_user_from_token(token, user_type)
                if not user:
                    return error_response('INVALID_TOKEN', status.HTTP_401_UNAUTHORIZED)
                request.user = user
                request.user_type = user_type
                return view_func(request, *args, **kwargs)
            
            return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
        return wrapper
    return decorator

def require_admin():
    """Decorator to require admin access only"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return error_response('ADMIN_ACCESS_REQUIRED', status.HTTP_403_FORBIDDEN)
            
            token = auth_header.split(' ')[1]
            
            # Check for hardcoded admin token (for initial setup)
            if token == 'admin-token':
                request.user = None
                request.user_type = 'admin'
                return view_func(request, *args, **kwargs)
            
            # Check for JWT token
            user = get_user_from_token(token, 'admin')
            if not user:
                return error_response('ADMIN_ACCESS_REQUIRED', status.HTTP_403_FORBIDDEN)
            
            request.user = user
            request.user_type = 'admin'
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator