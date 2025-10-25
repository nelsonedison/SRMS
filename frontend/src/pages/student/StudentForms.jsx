import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentForms } from '../../hooks/student';
import { useDepartment } from '../../hooks/department';

const StudentForms = () => {
  const { forms, loading, fetchForms } = useStudentForms();
  const { departments, fetchDepartments } = useDepartment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const dept = departments.find(d => d.name === selectedDepartment);
      fetchForms(dept?.id);
    } else {
      fetchForms();
    }
  }, [selectedDepartment]);

  const filteredForms = (forms || []).filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || form.department_name === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleFormClick = (formId) => {
    navigate(`/student/forms/${formId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Forms</h1>
          <p className="text-gray-600 mt-1">Browse and submit forms for various requests</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredForms.length} Forms Available</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
            >
              <option value="">All Departments</option>
              {departments?.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              )) || []}
            </select>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms?.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleFormClick(form.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {form.fields_count} fields
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{form.department_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium">
                Fill Form
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No forms found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default StudentForms;