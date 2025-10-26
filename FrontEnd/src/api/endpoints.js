export const APIENDPOINTS = {
    // Authentication Endpoints
    LOGIN: '/shared/login/',

    // Student Endpoints
    STUDENT_REGISTER: '/students/register/', // (POST) student registration
    STUDENT_PROFILE: '/students/profile/', // (GET) logged in student profile
    PENDING_STUDENTS: '/students/pending/', // (GET) pending student approvals
    APPROVED_STUDENT: '/students/approved/', // (GET) approved students
    APPROVE_OR_REJECT_STUDENT: (id) => `/students/${id}/approve/`, // (PUT) approve or reject student by id in path parameter

    // Teacher Endpoints
    CREATE_TEACHER: '/teachers/create/', // (POST) create a new teacher only by admin or principal
    LIST_TEACHERS: '/teachers/list/', // (GET) list all teachers (Role based access control)
    TEACHER_PROFILE: '/teachers/profile/', // (GET) logged in teacher profile
    EDIT_TEACHER: (id) => `/teachers/${id}/update/`, // (PUT) edit teacher details by id in path parameter
    DELETE_TEACHER: (id) => `/teachers/${id}/deactivate/`, // (DELETE) delete teacher by id in path parameter (Role based access control)

    // Admin Endpoints
    ADMIN_REGISTER: '/admin/register/', // (POST) admin registration (first time only)
    CREATE_ADMIN: '/admin/create/', // (POST) create a new admin only by admin
    LIST_ADMINS: '/admin/list/', // (GET) list all admins only by admin
    EDIT_ADMIN: (id) => `/admin/${id}/update/`, // (PUT) edit admin details by id in path parameter
    DELETE_ADMIN: (id) => `/admin/${id}/deactivate/`, // (DELETE) delete admin by id in path parameter only by admin

    // Department Endpoints
    DEPARTMENTS_LIST: '/shared/departments/', // (GET) list all departments
    DEPARTMENT_CREATE: '/shared/departments/create/', // (POST) create department (Admin/Principal)
    DEPARTMENT_UPDATE: (id) => `/shared/departments/${id}/update/`, // (PUT) update department by id

    // Course Endpoints
    COURSES_LIST: '/shared/courses/', // (GET) list all courses
    COURSE_CREATE: '/shared/courses/create/', // (POST) create course (Admin/Principal/HOD)
    COURSE_UPDATE: (id) => `/shared/courses/${id}/update/`, // (PUT) update course by id

    // Custom Forms Endpoints
    FORMS_LIST: '/shared/forms/', // (GET) list all forms
    FORM_DETAILS: (id) => `/shared/forms/${id}/`, // (GET) get specific form by id
    FORM_CREATE: '/shared/forms/create/', // (POST) create form (Admin/Principal/HOD)
    FORM_UPDATE: (id) => `/shared/forms/${id}/update/`, // (PUT) update form by id
    FORM_DELETE: (id) => `/shared/forms/${id}/delete/`, // (DELETE) delete form by id

    // Form Submissions Endpoints
    FORM_SUBMIT: (id) => `/shared/forms/${id}/submit/`, // (POST) submit form by id (Student only)
    MY_SUBMISSIONS: '/shared/submissions/my/', // (GET) get student's own submissions
    SUBMISSIONS_LIST: '/shared/submissions/', // (GET) list submissions (Teacher only)
    SUBMISSION_REVIEW: (id) => `/shared/submissions/${id}/review/`, // (PUT) review submission by id (Teacher only)
};