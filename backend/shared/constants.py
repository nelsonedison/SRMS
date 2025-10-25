"""Shared constants across all apps"""

DEPARTMENT_CHOICES = [
    ('CSE', 'Computer Science and Engineering'),
    ('ECE', 'Electronics and Communication Engineering'),
    ('EEE', 'Electrical and Electronics Engineering'),
    ('ME', 'Mechanical Engineering'),
    ('CE', 'Civil Engineering'),
]

COURSE_CHOICES = [
    ('BTECH', 'Bachelor of Technology'),
    ('MTECH', 'Master of Technology'),
    ('MBA', 'Master of Business Administration'),
    ('MCA', 'Master of Computer Applications'),
]

APPROVAL_STATUS_CHOICES = [
    ('pending', 'Pending Approval'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]

ROLE_CHOICES = [
    ('principal', 'Principal'),
    ('hod', 'Head of Department'),
    ('tutor', 'Tutor'),
]

# Error messages
ERROR_MESSAGES = {
    'INVALID_CREDENTIALS': 'Invalid credentials',
    'ACCESS_DENIED': 'Access denied',
    'AUTHENTICATION_REQUIRED': 'Authentication required',
    'ADMIN_ACCESS_REQUIRED': 'Admin access required',
    'INVALID_TOKEN': 'Invalid token',
    'USER_NOT_FOUND': 'User not found',
    'REGISTRATION_PENDING': 'Your registration is pending approval',
    'REGISTRATION_REJECTED': 'Your registration has been rejected',
    'ACADEMIC_YEAR_EXPIRED': 'Academic year has expired. Please contact administration',
    'ACCOUNT_INACTIVE': 'Account is inactive',
}

# Success messages
SUCCESS_MESSAGES = {
    'LOGIN_SUCCESS': 'Login successful',
    'REGISTRATION_SUCCESS': 'Registration submitted successfully! Please wait for admin approval.',
    'USER_CREATED': 'User created successfully',
    'USER_UPDATED': 'User updated successfully',
    'USER_DEACTIVATED': 'User deactivated successfully',
    'APPROVAL_SUCCESS': 'User approved successfully',
    'REJECTION_SUCCESS': 'User registration rejected',
}