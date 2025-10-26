from rest_framework import serializers
from .models import Department, Course

class DepartmentSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'is_active', 'created_by_type', 'created_by_name', 'created_at']
        read_only_fields = ['created_by_type', 'created_by_id', 'created_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by_type == 'admin':
            from adminpanel.models import AdminUser
            try:
                user = AdminUser.objects.get(id=obj.created_by_id)
                return user.name
            except AdminUser.DoesNotExist:
                return "Unknown Admin"
        elif obj.created_by_type == 'principal':
            from teachers.models import Teacher
            try:
                user = Teacher.objects.get(id=obj.created_by_id)
                return user.name
            except Teacher.DoesNotExist:
                return "Unknown Principal"
        return "Unknown"

class DepartmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name', 'code', 'description']

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'department', 'department_name', 'description', 'is_active', 'created_by_type', 'created_by_name', 'created_at']
        read_only_fields = ['created_by_type', 'created_by_id', 'created_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by_type == 'admin':
            from adminpanel.models import AdminUser
            try:
                user = AdminUser.objects.get(id=obj.created_by_id)
                return user.name
            except AdminUser.DoesNotExist:
                return "Unknown Admin"
        elif obj.created_by_type in ['principal', 'hod']:
            from teachers.models import Teacher
            try:
                user = Teacher.objects.get(id=obj.created_by_id)
                return user.name
            except Teacher.DoesNotExist:
                return f"Unknown {obj.created_by_type.title()}"
        return "Unknown"

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'code', 'department', 'description']