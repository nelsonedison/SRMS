from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Student

class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Student
        fields = ['name', 'phone_number', 'email', 'address', 'college_id', 'department', 'course', 'password']
    
    def validate_college_id(self, value):
        if Student.objects.filter(college_id=value).exists():
            raise serializers.ValidationError("College ID already exists.")
        return value
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Student.objects.create(**validated_data)

# class StudentLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

class PendingStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'phone_number', 'address', 'college_id', 
                 'department', 'course', 'approval_status', 'created_at']

class StudentApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'college_id', 'department', 'course', 
                 'approval_status', 'academic_year_start', 'academic_year_end']
        read_only_fields = ['id', 'name', 'email', 'college_id', 'department', 'course']