from rest_framework import serializers
from .form_models import CustomForm, FormField, FormSubmission

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id', 'label', 'field_type', 'is_required', 'placeholder', 'options', 'order']

class CustomFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomForm
        fields = ['id', 'title', 'description', 'department', 'department_name', 'is_active', 'fields', 'created_by_type', 'created_by_name', 'created_at']
        read_only_fields = ['created_by_type', 'created_by_id', 'created_at']
    
    def get_created_by_name(self, obj):
        if obj.created_by_type == 'admin':
            from adminpanel.models import AdminUser
            try:
                user = AdminUser.objects.get(id=obj.created_by_id)
                return user.name
            except AdminUser.DoesNotExist:
                return "Unknown Admin"
        elif obj.created_by_type in ['principal', 'hod', 'tutor']:
            from teachers.models import Teacher
            try:
                user = Teacher.objects.get(id=obj.created_by_id)
                return user.name
            except Teacher.DoesNotExist:
                return f"Unknown {obj.created_by_type.title()}"
        return "Unknown"

class FormCreateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)
    
    class Meta:
        model = CustomForm
        fields = ['title', 'description', 'department', 'fields']
    
    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        form = CustomForm.objects.create(**validated_data)
        
        for field_data in fields_data:
            FormField.objects.create(form=form, **field_data)
        
        return form

class FormSubmissionSerializer(serializers.ModelSerializer):
    form_title = serializers.CharField(source='form.title', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_college_id = serializers.CharField(source='student.college_id', read_only=True)
    reviewed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = FormSubmission
        fields = ['id', 'form', 'form_title', 'student', 'student_name', 'student_college_id', 'data', 'status', 'submitted_at', 'reviewed_by_name', 'tutor_reviewed_by', 'tutor_reviewed_at', 'tutor_comments', 'hod_reviewed_by', 'hod_reviewed_at', 'hod_comments', 'principal_reviewed_by', 'principal_reviewed_at', 'principal_comments']
        read_only_fields = ['student', 'submitted_at', 'tutor_reviewed_by', 'tutor_reviewed_at', 'tutor_comments', 'hod_reviewed_by', 'hod_reviewed_at', 'hod_comments', 'principal_reviewed_by', 'principal_reviewed_at', 'principal_comments']
    
    def get_reviewed_by_name(self, obj):
        # This method is no longer needed as we have separate reviewer fields
        return None

class FormSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormSubmission
        fields = ['form', 'data']