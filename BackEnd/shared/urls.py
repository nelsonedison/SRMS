from django.urls import path
from . import views, form_views, auth_views

urlpatterns = [
    # Common Authentication
    path('login/', auth_views.common_login, name='common_login'),
    
    # Department Management
    path('departments/', views.list_departments, name='list_departments'),
    path('departments/create/', views.create_department, name='create_department'),
    path('departments/<int:dept_id>/update/', views.update_department, name='update_department'),
    
    # Course Management
    path('courses/', views.list_courses, name='list_courses'),
    path('courses/create/', views.create_course, name='create_course'),
    path('courses/<int:course_id>/update/', views.update_course, name='update_course'),
    
    # Custom Forms
    path('forms/', form_views.list_forms, name='list_forms'),
    path('forms/<int:form_id>/', form_views.get_form, name='get_form'),
    path('forms/create/', form_views.create_form, name='create_form'),
    path('forms/<int:form_id>/update/', form_views.update_form, name='update_form'),
    path('forms/<int:form_id>/delete/', form_views.delete_form, name='delete_form'),
    
    # Form Submissions
    path('forms/<int:form_id>/submit/', form_views.submit_form, name='submit_form'),
    path('submissions/my/', form_views.my_submissions, name='my_submissions'),
    path('submissions/', form_views.list_submissions, name='list_submissions'),
    path('submissions/<int:submission_id>/review/', form_views.review_submission, name='review_submission'),
]