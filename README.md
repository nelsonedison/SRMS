# SRMS - Student Request Management System

## Abstract

The Student Request Management System (SRMS) is a comprehensive web-based application designed to streamline academic administration and student data management in educational institutions. Built with modern full-stack technologies, SRMS provides a centralized platform for managing student request records, teacher information, and administrative operations through role-based access control and hierarchical approval workflows.

The system addresses the critical need for efficient student data management by offering features such as dynamic form creation, department-wise course management, and multi-level approval processes. With its intuitive user interface and robust backend architecture, SRMS enhances operational efficiency while maintaining data security and integrity.

## Features

- **Student Management**: Complete student lifecycle management with enrollment, academic records, and profile management
- **Teacher Administration**: Teacher profiles, course assignments, and departmental management
- **Admin Panel**: System-wide administration with user role management and system configuration
- **Dynamic Forms**: Customizable forms with approval workflows and hierarchical permissions
- **Role-Based Access**: Secure access control for students, teachers, HODs, and administrators
- **Department & Course Management**: Dynamic department and course creation with flexible assignments
- **Approval Workflows**: Multi-level approval processes for various academic operations

## Technology Stack

### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework 3.14+** - API development
- **PyJWT 2.8+** - Authentication
- **SQLite/PostgreSQL** - Database

### Frontend
- **React 19.1+** - UI framework
- **Vite 7.1+** - Build tool
- **Tailwind CSS 4.1+** - Styling
- **Axios 1.12+** - HTTP client
- **React Router DOM 7.9+** - Routing

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd BackEnd
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Project Structure

```
SRMS/
├── BackEnd/                 # Django backend
│   ├── adminpanel/         # Admin management
│   ├── core/               # Core functionality
│   ├── shared/             # Shared components
│   ├── students/           # Student management
│   ├── teachers/           # Teacher management
│   └── backend_project/    # Django configuration
├── FrontEnd/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── api/            # API integration
│   │   └── contexts/       # React contexts
└── README.md
```

## API Documentation

The system provides RESTful APIs for:
- Authentication and authorization
- Student CRUD operations
- Teacher management
- Admin panel operations
- Dynamic form handling
- Approval workflow management

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- CORS configuration
- Secure API endpoints
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
