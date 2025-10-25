import React, { useState, useEffect } from 'react';
import { FileText, Search, Calendar, Building, Eye } from 'lucide-react';
import { useForm } from '../../hooks/form';
import Toast from '../../components/static/Toast';

const TutorForms = () => {
  const { listForms, loading, toast, closeToast } = useForm();
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await listForms();
      setForms(data.forms || []);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.department_name && form.department_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <p className="text-gray-600 mt-1">Forms available for students in your course</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredForms.length} Forms</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{form.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{form.department_name || 'All Departments'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(form.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fields:</span> {form.fields?.length || 0}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Form ID: {form.id}
                </div>
                <button
                  onClick={() => window.open(`/forms/${form.id}`, '_blank')}
                  className="flex items-center gap-2 px-3 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Form
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No forms found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'No forms are currently available'}
          </p>
        </div>
      )}

      {/* Information Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-700 mb-2">About Forms</h3>
        <p className="text-gray-700 leading-relaxed">
          These are the forms available for students in your course to submit. Students can fill out these forms, 
          and their submissions will come to you for initial review before being forwarded to the HOD and Principal 
          for final approval.
        </p>
      </div>

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default TutorForms;