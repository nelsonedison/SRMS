from django.contrib import admin
from .models import Teacher

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['name', 'employee_id', 'role', 'department', 'is_active', 'created_at']
    list_filter = ['role', 'department', 'is_active']
    search_fields = ['name', 'email', 'employee_id']
    readonly_fields = ['created_at', 'updated_at']