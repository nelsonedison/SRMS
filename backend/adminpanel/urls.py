from django.urls import path
from . import views

urlpatterns = [
    # Admin Registration
    path('register/', views.register_admin, name='register_admin'),
    
    # Admin Management
    path('create/', views.create_admin, name='create_admin'),
    path('list/', views.list_admins, name='list_admins'),
    path('<int:admin_id>/update/', views.update_admin, name='update_admin'),
    path('<int:admin_id>/deactivate/', views.deactivate_admin, name='deactivate_admin'),
]