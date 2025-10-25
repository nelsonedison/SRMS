from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from shared.constants import ROLE_CHOICES
from shared.models import Department

class Teacher(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    employee_id = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    course = models.ForeignKey('shared.Course', on_delete=models.CASCADE, null=True, blank=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def clean(self):
        # Only one active principal allowed
        if self.role == 'principal' and self.is_active:
            existing_principal = Teacher.objects.filter(
                role='principal', is_active=True
            ).exclude(pk=self.pk)
            if existing_principal.exists():
                raise ValidationError("Only one active principal is allowed.")
        
        # Principal doesn't need department
        if self.role == 'principal' and self.department:
            raise ValidationError("Principal should not be assigned to a department.")
        
        # HOD must have department, Tutor must have department and course
        if self.role == 'hod' and not self.department_id:
            raise ValidationError("HOD must be assigned to a department.")
        if self.role == 'tutor' and (not self.department_id or not self.course_id):
            raise ValidationError("Tutor must be assigned to both department and course.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"
    
    def can_manage_user(self, target_user):
        """Check if this teacher can manage the target user"""
        if self.role == 'principal':
            return target_user.role in ['hod', 'tutor']
        elif self.role == 'hod':
            return (target_user.role == 'tutor' and 
                   target_user.department_id == self.department_id)
        return False