from django.db import models
from django.utils import timezone
import json

FIELD_TYPE_CHOICES = [
    ('text', 'Text Input'),
    ('textarea', 'Text Area'),
    ('number', 'Number'),
    ('email', 'Email'),
    ('date', 'Date'),
    ('select', 'Dropdown'),
    ('radio', 'Radio Button'),
    ('checkbox', 'Checkbox'),
    ('file', 'File Upload'),
]

class CustomForm(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    department = models.ForeignKey('shared.Department', on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by_type = models.CharField(max_length=20)
    created_by_id = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title

class FormField(models.Model):
    form = models.ForeignKey(CustomForm, on_delete=models.CASCADE, related_name='fields')
    label = models.CharField(max_length=200)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPE_CHOICES)
    is_required = models.BooleanField(default=False)
    placeholder = models.CharField(max_length=200, blank=True)
    options = models.JSONField(default=list, blank=True)  # For select/radio/checkbox
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.form.title} - {self.label}"

class FormSubmission(models.Model):
    form = models.ForeignKey(CustomForm, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    data = models.JSONField()
    status = models.CharField(max_length=20, choices=[
        ('pending_tutor', 'Pending Tutor Approval'),
        ('pending_hod', 'Pending HOD Approval'),
        ('pending_principal', 'Pending Principal Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending_tutor')
    submitted_at = models.DateTimeField(default=timezone.now)
    
    # Tutor review
    tutor_reviewed_by = models.ForeignKey('teachers.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='tutor_reviews')
    tutor_reviewed_at = models.DateTimeField(null=True, blank=True)
    tutor_comments = models.TextField(blank=True)
    
    # HOD review
    hod_reviewed_by = models.ForeignKey('teachers.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='hod_reviews')
    hod_reviewed_at = models.DateTimeField(null=True, blank=True)
    hod_comments = models.TextField(blank=True)
    
    # Principal review
    principal_reviewed_by = models.ForeignKey('teachers.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='principal_reviews')
    principal_reviewed_at = models.DateTimeField(null=True, blank=True)
    principal_comments = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.form.title} - {self.student.name}"