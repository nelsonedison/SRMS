from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import AdminUser
from .serializers import *
from shared.utils import generate_jwt_token, success_response, error_response
from shared.decorators import require_admin

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def admin_login(request):
#     serializer = AdminLoginSerializer(data=request.data)
#     if not serializer.is_valid():
#         return error_response(serializer.errors)
    
#     email = serializer.validated_data['email']
#     password = serializer.validated_data['password']
    
#     try:
#         admin = AdminUser.objects.get(email=email, is_active=True)
        
#         if not check_password(password, admin.password):
#             return error_response('INVALID_CREDENTIALS')
        
#         token = generate_jwt_token(admin, 'admin')
        
#         return success_response('LOGIN_SUCCESS', {
#             "token": token,
#             "admin": {
#                 "id": admin.id,
#                 "name": admin.name,
#                 "email": admin.email,
#                 "is_superuser": admin.is_superuser
#             }
#         })
        
#     except AdminUser.DoesNotExist:
#         return error_response('INVALID_CREDENTIALS')

@api_view(['POST'])
@permission_classes([AllowAny])
def register_admin(request):
    # Check if any admin exists
    if AdminUser.objects.exists():
        return error_response('Admin registration is disabled. Contact existing admin.', status.HTTP_403_FORBIDDEN)
    
    serializer = AdminCreateSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.save(is_superuser=True)
        return success_response('First admin registered successfully', {
            "admin_id": admin.id,
            "email": admin.email
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['POST'])
@require_admin()
def create_admin(request):
    serializer = AdminCreateSerializer(data=request.data)
    if serializer.is_valid():
        admin = serializer.save()
        return success_response('USER_CREATED', {
            "admin_id": admin.id,
            "email": admin.email
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['GET'])
@require_admin()
def list_admins(request):
    admins = AdminUser.objects.filter(is_active=True)
    serializer = AdminListSerializer(admins, many=True)
    return success_response('', {"admins": serializer.data})

@api_view(['PUT'])
@require_admin()
def update_admin(request, admin_id):
    try:
        admin = AdminUser.objects.get(id=admin_id)
    except AdminUser.DoesNotExist:
        return error_response('USER_NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    serializer = AdminUpdateSerializer(admin, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return success_response('USER_UPDATED')
    return error_response(serializer.errors)

@api_view(['DELETE'])
@require_admin()
def deactivate_admin(request, admin_id):
    try:
        admin = AdminUser.objects.get(id=admin_id)
    except AdminUser.DoesNotExist:
        return error_response('USER_NOT_FOUND', status.HTTP_404_NOT_FOUND)
    
    admin.is_active = False
    admin.save()
    return success_response('USER_DEACTIVATED')