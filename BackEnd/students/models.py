from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from shared.constants import APPROVAL_STATUS_CHOICES
from shared.models import Department, Course

def validate_icet_email(value):
    if not value.endswith('@icet.ac.in'):
        raise ValidationError("Only @icet.ac.in emails are allowed for registration.")

class Student(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    address = models.TextField()
    college_id = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    password = models.CharField(max_length=255)
    
    # Approval system
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    # Academic year management
    academic_year_start = models.DateField(null=True, blank=True)
    academic_year_end = models.DateField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    # Account active flag
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.college_id})"
    
    def is_academic_year_active(self):
        """Check if student's academic year is currently active"""
        if not self.academic_year_start or not self.academic_year_end:
            return False
        today = timezone.now().date()
        return self.academic_year_start <= today <= self.academic_year_end
    
    def can_login(self):
        """Check if student can login (approved and academic year active)"""
        return self.is_active and self.approval_status == 'approved' and self.is_academic_year_active()