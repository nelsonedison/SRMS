from django.urls import path
from . import views

urlpatterns = [
    # Teacher Profile
    path('profile/', views.teacher_profile, name='teacher_profile'),
    path('<int:teacher_id>/details/', views.get_teacher_details, name='get_teacher_details'),
    
    # Teacher Management (Admin/Principal/HOD)
    path('create/', views.create_teacher, name='create_teacher'),
    path('list/', views.list_teachers, name='list_teachers'),
    path('<int:teacher_id>/update/', views.update_teacher, name='update_teacher'),
    path('<int:teacher_id>/deactivate/', views.deactivate_teacher, name='deactivate_teacher'),
]