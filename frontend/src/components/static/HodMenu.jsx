import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Eye, 
  Settings, 
  LogOut, 
  Crown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/auth';

const HodMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/hod', icon: <BarChart2 size={18} />, label: 'Dashboard', color: 'from-teal-500 to-cyan-500' },
    { path: '/hod/tutors', icon: <Users size={18} />, label: 'Tutors', color: 'from-blue-500 to-indigo-500' },
    { path: '/hod/forms', icon: <FileText size={18} />, label: 'Forms', color: 'from-green-500 to-emerald-500' },
    { path: '/hod/submissions', icon: <Eye size={18} />, label: 'Reviews', color: 'from-orange-500 to-red-500' },
    { path: '/hod/profile', icon: <Settings size={18} />, label: 'Profile', color: 'from-purple-500 to-violet-500' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`h-screen bg-white/90 backdrop-blur-md border-r border-white/20 shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'} flex flex-col`}>
      <div className={`${collapsed ? 'p-3' : 'p-6'} border-b border-gray-100/50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <Crown className="text-white w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  HOD PORTAL
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Department Head
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
                  ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-md'
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
                <div className="absolute right-2 w-2 h-2 bg-teal-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>

      <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-gray-100/50`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2 p-2' : 'gap-3 p-3'} rounded-xl bg-gradient-to-r from-gray-50 to-gray-100`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold flex items-center justify-center shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{user?.name || 'HOD User'}</div>
              <div className="text-xs text-gray-500">Head of Department</div>
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

export default HodMenu;