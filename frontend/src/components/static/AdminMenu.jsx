import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  UserCog, 
  FileText, 
  Eye, 
  Database, 
  Settings, 
  LogOut, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks/auth';

const AdminMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <BarChart2 size={18} />, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/admin/students', icon: <Users size={18} />, label: 'Students', color: 'from-green-500 to-emerald-500' },
    { path: '/admin/teachers', icon: <UserCog size={18} />, label: 'Teachers', color: 'from-purple-500 to-violet-500' },
    { path: '/admin/departments', icon: <Database size={18} />, label: 'Departments', color: 'from-pink-500 to-rose-500' },
    { path: '/admin/courses', icon: <BookOpen size={18} />, label: 'Courses', color: 'from-indigo-500 to-purple-500' },
    { path: '/admin/forms', icon: <FileText size={18} />, label: 'Forms', color: 'from-orange-500 to-red-500' },
    { path: '/admin/submissions', icon: <Eye size={18} />, label: 'Submissions', color: 'from-purple-500 to-pink-500' },
    // { path: '/admin/settings', icon: <Settings size={18} />, label: 'Settings', color: 'from-gray-500 to-slate-500' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`bg-white/90 backdrop-blur-md border-r border-white/20 shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'} flex flex-col`}>
      <div className={`${collapsed ? 'p-3' : 'p-6'} border-b border-gray-100/50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Shield className="text-white w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ADMIN
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Management Portal
                </div>
              </div>
            )}
          </div>
          <button
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} space-y-2`}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? `bg-gradient-to-r ${item.color} text-white shadow-lg` : 'bg-gray-100 group-hover:bg-gray-200'} transition-all`}>
                {item.icon}
              </div>
              {!collapsed && (
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                </div>
              )}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>

      <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-gray-100/50`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2 p-2' : 'gap-3 p-3'} rounded-xl bg-gradient-to-r from-gray-50 to-gray-100`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-500">System Administrator</div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

      </div>
    </aside>
  );
};

export default AdminMenu;