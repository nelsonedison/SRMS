import React from "react";
import { Users, FileText, ClipboardList, Database, TrendingUp, Activity, Clock, CheckCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const stats = [
  { title: "Total Students", value: 1200, change: "+12%", icon: <Users size={24} />, color: "from-blue-500 to-cyan-500" },
  { title: "Pending Requests", value: 87, change: "-8%", icon: <Clock size={24} />, color: "from-orange-500 to-red-500" },
  { title: "Approved Today", value: 45, change: "+23%", icon: <CheckCircle size={24} />, color: "from-green-500 to-emerald-500" },
  { title: "System Health", value: "98%", change: "+2%", icon: <Activity size={24} />, color: "from-purple-500 to-violet-500" },
];

const requestTrend = [
  { month: "Jan", requests: 40, approved: 35 },
  { month: "Feb", requests: 70, approved: 60 },
  { month: "Mar", requests: 90, approved: 80 },
  { month: "Apr", requests: 120, approved: 110 },
  { month: "May", requests: 150, approved: 140 },
  { month: "Jun", requests: 180, approved: 170 },
];

const pieData = [
  { name: "Wi-Fi Access", value: 120, color: "#3B82F6" },
  { name: "Leave Applications", value: 200, color: "#10B981" },
  { name: "Hostel Requests", value: 150, color: "#F59E0B" },
  { name: "Permission Letters", value: 90, color: "#EF4444" },
];

const activities = [
  { id: 1, text: "John Doe submitted Leave Application", time: "2 min ago", type: "request" },
  { id: 2, text: "Wi-Fi Access approved by System", time: "5 min ago", type: "approval" },
  { id: 3, text: "New student registration completed", time: "10 min ago", type: "registration" },
  { id: 4, text: "System backup completed successfully", time: "1 hour ago", type: "system" },
];

const StatCard = ({ title, value, change, icon, color }) => (
  <Card className="group hover:scale-105 transition-transform">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm flex items-center gap-1 mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp size={14} />
          {change} from last month
        </p>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
        {icon}
      </div>
    </div>
  </Card>
);

const ActivityItem = ({ text, time, type }) => {
  const typeColors = {
    request: 'bg-blue-100 text-blue-800',
    approval: 'bg-green-100 text-green-800',
    registration: 'bg-purple-100 text-purple-800',
    system: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${typeColors[type]?.replace('text-', 'bg-').replace('100', '500')}`}></div>
        <span className="text-sm text-gray-700">{text}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs ${typeColors[type]}`}>
          {type}
        </span>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your system today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Request Analytics</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Approved</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={requestTrend}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={3} />
              <Area type="monotone" dataKey="approved" stroke="#10B981" fillOpacity={1} fill="url(#colorApproved)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all group">
              <Users className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-blue-900">Manage Students</p>
            </button>
            <button className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all group">
              <ClipboardList className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-green-900">View Requests</p>
            </button>
            <button className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 hover:from-purple-100 hover:to-violet-100 transition-all group">
              <Database className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-purple-900">System Logs</p>
            </button>
            <button className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all group">
              <FileText className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-orange-900">Generate Report</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;