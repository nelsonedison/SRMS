import { Outlet } from 'react-router-dom';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdminMenu from '../components/static/AdminMenu';
import { useAuth } from '../hooks/auth';

const AdminLayout = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex overflow-hidden">
      <AdminMenu />

      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative">
                  {/* Clock face */}
                  <div className="w-8 h-8 bg-white/20 rounded-full relative">
                    {/* Hour hand */}
                    <div
                      className="absolute w-0.5 h-2 bg-white rounded-full origin-bottom"
                      style={{
                        left: '50%',
                        bottom: '50%',
                        transform: `translateX(-50%) rotate(${(new Date().getHours() % 12) * 30 + (new Date().getMinutes() * 0.5)}deg)`
                      }}
                    ></div>
                    {/* Minute hand */}
                    <div
                      className="absolute w-0.5 h-3 bg-white rounded-full origin-bottom"
                      style={{
                        left: '50%',
                        bottom: '50%',
                        transform: `translateX(-50%) rotate(${new Date().getMinutes() * 6}deg)`
                      }}
                    ></div>
                    {/* Second hand */}
                    <div
                      className="absolute w-px h-3.5 bg-red-400 rounded-full origin-bottom"
                      style={{
                        left: '50%',
                        bottom: '50%',
                        transform: `translateX(-50%) rotate(${new Date().getSeconds() * 6}deg)`
                      }}
                    ></div>
                    {/* Center dot */}
                    <div className="absolute w-1 h-1 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800 tracking-wide">
                    {time}
                  </div>
                  <div className="text-sm text-gray-600 font-medium -mt-1">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="p-2.5 rounded-xl bg-gray-100/50 hover:bg-gray-200/50 transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-200/50">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center shadow-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;