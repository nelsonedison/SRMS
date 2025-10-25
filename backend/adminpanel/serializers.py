from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import AdminUser

# class AdminLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

class AdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = AdminUser
        fields = ['name', 'email', 'password', 'is_superuser']
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return AdminUser.objects.create(**validated_data)

class AdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'name', 'email', 'is_superuser', 'is_active', 'created_at']

class AdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['name', 'email', 'is_superuser', 'is_active']