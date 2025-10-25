# from django.contrib import admin
# from .models import Student


# @admin.register(Student)
# class StudentAdmin(admin.ModelAdmin):
#     list_display = ['name', 'college_id', 'email', 'department', 'course', 'approval_status', 'created_at']
#     list_filter = ['department', 'course', 'approval_status', 'created_at']
#     search_fields = ['name', 'email', 'college_id']
#     readonly_fields = ['created_at', 'updated_at', 'approved_at']
    
#     fieldsets = (
#         ('Personal Information', {
#             'fields': ('name', 'email', 'phone_number', 'address')
#         }),
#         ('Academic Information', {
#             'fields': ('college_id', 'department', 'course')
#         }),
#         ('Approval Status', {
#             'fields': ('approval_status', 'approved_at', 'academic_year_start', 'academic_year_end')
#         }),
#         ('Timestamps', {
#             'fields': ('created_at', 'updated_at')
#         }),
#     )