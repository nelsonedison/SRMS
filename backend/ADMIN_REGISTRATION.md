# Admin Registration Guide

## Initial Admin Registration

### **First Admin Registration (No Authentication Required)**
```http
POST /api/admin/register/
```

**When to use:** Only when no admin exists in the system (first-time setup)

**Request:**
```json
{
  "name": "System Administrator",
  "email": "admin@icet.ac.in",
  "password": "securepassword123",
  "is_superuser": true
}
```

**Response (Success):**
```json
{
  "message": "First admin registered successfully",
  "admin_id": 1,
  "email": "admin@icet.ac.in"
}
```

**Response (If admin already exists):**
```json
{
  "error": "Admin registration is disabled. Contact existing admin."
}
```

## Subsequent Admin Creation

### **Create Additional Admins (Requires Existing Admin)**
```http
POST /api/admin/create/
```

**Headers:** `Authorization: Bearer admin-token`

**Request:**
```json
{
  "name": "Additional Admin",
  "email": "admin2@icet.ac.in",
  "password": "password123",
  "is_superuser": false
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "admin_id": 2,
  "email": "admin2@icet.ac.in"
}
```

## Admin Login
```http
POST /api/admin/login/
```

**Request:**
```json
{
  "email": "admin@icet.ac.in",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "admin": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@icet.ac.in",
    "is_superuser": true
  }
}
```

## Setup Flow

### **1. Initial System Setup**
1. Deploy the application
2. Use `/api/admin/register/` to create the first admin
3. Login with the first admin credentials
4. Create departments, courses, and teachers as needed

### **2. Adding More Admins**
1. Login as existing admin
2. Use `/api/admin/create/` to add more admins
3. Set `is_superuser: false` for regular admins

## Security Notes

- **First admin registration** is only available when no admin exists
- After first admin is created, registration endpoint is automatically disabled
- Only existing admins can create new admin accounts
- Use strong passwords for admin accounts
- Consider setting `is_superuser: false` for additional admins unless full access is needed

## Frontend Implementation

```javascript
// Check if first admin registration is available
const checkFirstAdminSetup = async () => {
  try {
    const response = await axios.post('/api/admin/register/', {
      name: "Test",
      email: "test@test.com", 
      password: "test"
    });
    // If successful, show admin registration form
    return true;
  } catch (error) {
    if (error.response?.data?.error?.includes('disabled')) {
      // Admin exists, show login form instead
      return false;
    }
  }
};

// First admin registration
const registerFirstAdmin = async (adminData) => {
  const response = await axios.post('/api/admin/register/', adminData);
  localStorage.setItem('adminToken', response.data.token);
  return response.data;
};
```