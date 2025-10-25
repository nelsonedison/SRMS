from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .utils import verify_jwt_token

def jwt_required(allowed_roles=None):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            auth_header = request.headers.get('Authorization', None)
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response({'error': 'Authorization header missing or invalid.'},
                                status=status.HTTP_401_UNAUTHORIZED)

            token = auth_header.split(' ')[1]
            decoded = verify_jwt_token(token)
            if not decoded:
                return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

            # Role check
            if allowed_roles and decoded['role'] not in allowed_roles:
                return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

            request.user_data = decoded
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
