import React, { useState, useEffect } from "react";
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
import { useTeacher } from '../../hooks/teacher';
import { useStudentSubmissions } from '../../hooks/student';
import { useForm } from '../../hooks/form';
import { useDepartment } from '../../hooks/department';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);



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



const AdminDashboard = () => {
  const { listTeachers } = useTeacher();
  const { listSubmissions } = useForm();
  const { departments, listDepartments } = useDepartment();
  
  const [stats, setStats] = useState([
    { title: "Total Teachers", value: 0, change: "+0%", icon: <Users size={24} />, color: "from-blue-500 to-cyan-500" },
    { title: "Pending Requests", value: 0, change: "-0%", icon: <Clock size={24} />, color: "from-orange-500 to-red-500" },
    { title: "Approved Today", value: 0, change: "+0%", icon: <CheckCircle size={24} />, color: "from-green-500 to-emerald-500" },
    { title: "Total Departments", value: 0, change: "+0%", icon: <Activity size={24} />, color: "from-purple-500 to-violet-500" },
  ]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [teachersData, submissionsData, departmentsData] = await Promise.all([
        listTeachers().catch(() => ({ teachers: [] })),
        listSubmissions().catch(() => ({ submissions: [] })),
        listDepartments().catch(() => ({ departments: [] }))
      ]);

      const teachers = teachersData.teachers || [];
      const allSubmissions = submissionsData.submissions || [];
      const allDepartments = departmentsData.departments || departments || [];

      // Calculate stats
      const pendingSubmissions = allSubmissions.filter(s => s.status.includes('pending')).length;
      const approvedToday = allSubmissions.filter(s => {
        const today = new Date().toDateString();
        const submissionDate = new Date(s.submitted_at).toDateString();
        return s.status === 'approved' && submissionDate === today;
      }).length;

      setStats([
        { title: "Total Teachers", value: teachers.length, change: "+0%", icon: <Users size={24} />, color: "from-blue-500 to-cyan-500" },
        { title: "Pending Requests", value: pendingSubmissions, change: "-0%", icon: <Clock size={24} />, color: "from-orange-500 to-red-500" },
        { title: "Approved Today", value: approvedToday, change: "+0%", icon: <CheckCircle size={24} />, color: "from-green-500 to-emerald-500" },
        { title: "Total Departments", value: allDepartments.length, change: "+0%", icon: <Activity size={24} />, color: "from-purple-500 to-violet-500" },
      ]);

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data from submissions
  const generateChartData = () => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthSubmissions = submissions.filter(s => {
        const submissionDate = new Date(s.submitted_at);
        return submissionDate.getMonth() === date.getMonth() && 
               submissionDate.getFullYear() === date.getFullYear();
      });
      
      last6Months.push({
        month: monthName,
        requests: monthSubmissions.length,
        approved: monthSubmissions.filter(s => s.status === 'approved').length
      });
    }
    
    return last6Months;
  };

  // Generate pie chart data from submissions
  const generatePieData = () => {
    const formCounts = {};
    submissions.forEach(s => {
      formCounts[s.form_title] = (formCounts[s.form_title] || 0) + 1;
    });
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return Object.entries(formCounts).slice(0, 5).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  const requestTrend = generateChartData();
  const pieData = generatePieData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{submissions.length}</p>
                  <p className="text-sm text-blue-700">Total Submissions</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{submissions.filter(s => s.status === 'approved').length}</p>
                  <p className="text-sm text-green-700">Total Approved</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">{submissions.filter(s => s.status.includes('pending')).length}</p>
                  <p className="text-sm text-orange-700">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{submissions.filter(s => s.status === 'rejected').length}</p>
                  <p className="text-sm text-red-700">Rejected</p>
                </div>
              </div>
            </div>
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
      </div> */}
    </div>
  );
};

export default AdminDashboard;