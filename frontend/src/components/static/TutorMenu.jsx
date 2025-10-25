import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  User, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../hooks/auth';

const TutorMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/tutor', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tutor/students', icon: Users, label: 'Students' },
    { path: '/tutor/submissions', icon: ClipboardList, label: 'Reviews' },
    { path: '/tutor/forms', icon: FileText, label: 'Forms' },
    { path: '/tutor/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-600 to-emerald-700 text-white h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-green-500">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Tutor Portal</h2>
            <p className="text-green-100 text-sm">Course Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-500">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-green-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TutorMenu;