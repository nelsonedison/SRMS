from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Teacher
from students.models import Student


# class PendingStudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ['id', 'name', 'email', 'phone_number', 'address', 'college_id', 
#                  'department', 'course', 'approval_status', 'created_at']


# class StudentApprovalSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ['id', 'name', 'email', 'college_id', 'department', 'course', 
#                  'approval_status', 'academic_year_start', 'academic_year_end']
#         read_only_fields = ['id', 'name', 'email', 'college_id', 'department', 'course']

class TeacherCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Teacher
        fields = ['name', 'email', 'phone_number', 'employee_id', 'role', 'department', 'course', 'password']
    
    def validate_employee_id(self, value):
        if Teacher.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID already exists.")
        return value
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Teacher.objects.create(**validated_data)

class TeacherLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class TeacherListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'name', 'email', 'employee_id', 'role', 'department', 'is_active', 'created_at']

class TeacherUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['name', 'email', 'phone_number', 'department', 'is_active']
        
    def validate(self, data):
        instance = self.instance
        if instance.role == 'principal' and data.get('department'):
            raise serializers.ValidationError("Principal cannot be assigned to a department.")
        if instance.role in ['hod', 'tutor'] and not data.get('department', instance.department):
            raise serializers.ValidationError(f"{instance.get_role_display()} must have a department.")
        return data