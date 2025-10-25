from django.db import models
from django.utils import timezone

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by_type = models.CharField(max_length=20)  # 'admin' or 'principal'
    created_by_id = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by_type = models.CharField(max_length=20)  # 'admin', 'principal', or 'hod'
    created_by_id = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.code} - {self.name}"