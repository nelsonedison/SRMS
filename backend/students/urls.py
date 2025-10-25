from django.urls import path
from . import views

urlpatterns = [
    # Student Registration
    path('register/', views.register_student, name='register_student'),
    path('profile/', views.student_profile, name='student_profile'),
    
    # Teacher Student Management (HOD/Principal)
    path('pending/', views.get_pending_students, name='pending_students'),
    path('approved/', views.get_approved_students, name='approved_students'),
    path('<int:student_id>/approve/', views.approve_student, name='approve_student'),
]