from rest_framework.decorators import api_view
from rest_framework import status
from .models import Department, Course
from .serializers import *
from .utils import success_response, error_response
from .decorators import require_auth

@api_view(['GET'])
def list_departments(request):
    departments = Department.objects.filter(is_active=True)
    serializer = DepartmentSerializer(departments, many=True)
    return success_response('', {"departments": serializer.data})

@api_view(['POST'])
@require_auth('teacher', allow_admin=True)
def create_department(request):
    print(f"request user type in create department: {request.user_type}")
    if request.user_type == 'admin':
        created_by_type = 'admin'
        created_by_id = request.user.id
    elif request.user.role == 'principal':
        created_by_type = 'principal'
        created_by_id = request.user.id
    else:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    serializer = DepartmentCreateSerializer(data=request.data)
    if serializer.is_valid():
        department = serializer.save(
            created_by_type=created_by_type,
            created_by_id=created_by_id
        )
        return success_response('Department created successfully', {
            "department_id": department.id,
            "code": department.code
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['GET'])
def list_courses(request):
    department_id = request.GET.get('department_id')
    if department_id:
        courses = Course.objects.filter(department_id=department_id, is_active=True)
    else:
        courses = Course.objects.filter(is_active=True)
    
    serializer = CourseSerializer(courses, many=True)
    return success_response('', {"courses": serializer.data})

@api_view(['POST'])
@require_auth('teacher', allow_admin=True)
def create_course(request):
    if request.user_type == 'admin':
        created_by_type = 'admin'
        created_by_id = request.user.id
    elif request.user.role == 'principal':
        created_by_type = 'principal'
        created_by_id = request.user.id
    elif request.user.role == 'hod':
        created_by_type = 'hod'
        created_by_id = request.user.id
        
        # HOD can only create courses in their department
        department_id = request.data.get('department')
        if not department_id or str(department_id) != str(request.user.department_id):
            return error_response('HOD can only create courses in their own department', status.HTTP_403_FORBIDDEN)
    else:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    serializer = CourseCreateSerializer(data=request.data)
    if serializer.is_valid():
        course = serializer.save(
            created_by_type=created_by_type,
            created_by_id=created_by_id
        )
        return success_response('Course created successfully', {
            "course_id": course.id,
            "code": course.code
        }, status.HTTP_201_CREATED)
    return error_response(serializer.errors)

@api_view(['PUT'])
@require_auth('teacher', allow_admin=True)
def update_department(request, dept_id):
    if request.user_type != 'admin' and request.user.role != 'principal':
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    try:
        department = Department.objects.get(id=dept_id)
    except Department.DoesNotExist:
        return error_response('Department not found', status.HTTP_404_NOT_FOUND)
    
    serializer = DepartmentCreateSerializer(department, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return success_response('Department updated successfully')
    return error_response(serializer.errors)

@api_view(['PUT'])
@require_auth('teacher', allow_admin=True)
def update_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return error_response('Course not found', status.HTTP_404_NOT_FOUND)
    
    if request.user_type == 'admin' or request.user.role == 'principal':
        pass  # Full access
    elif request.user.role == 'hod' and course.department_id == request.user.department_id:
        pass  # HOD can update courses in their department
    else:
        return error_response('ACCESS_DENIED', status.HTTP_403_FORBIDDEN)
    
    serializer = CourseCreateSerializer(course, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return success_response('Course updated successfully')
    return error_response(serializer.errors)