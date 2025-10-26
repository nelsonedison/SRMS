import React, { useState, useEffect } from 'react';
import { Building, BookOpen, Plus, Edit3, Users } from 'lucide-react';
import { useDepartment } from '../../hooks/department';
import Toast from '../../components/static/Toast';

const PrincipalDepartments = () => {
  const { 
    departments, 
    courses, 
    fetchDepartments, 
    fetchCourses, 
    createDepartment, 
    createCourse,
    loading,
    toast,
    closeToast 
  } = useDepartment();

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    department: '',
    description: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  const handleCreateDepartment = async () => {
    try {
      await createDepartment(newDepartment);
      setShowDeptModal(false);
      setNewDepartment({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Failed to create department:', error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      await createCourse({
        ...newCourse,
        department: parseInt(newCourse.department)
      });
      setShowCourseModal(false);
      setNewCourse({ name: '', code: '', department: '', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department & Course Management</h1>
          <p className="text-gray-600 mt-1">Manage academic structure and organization</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
          <Building className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeptModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Department
          </button>
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </button>
        </div>
      </div>

      {/* Departments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Building className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Departments ({departments.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {dept.code}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Courses: {courses.filter(c => c.department === dept.id).length}
                </span>
                <span className="text-gray-500">
                  By: {dept.created_by_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Courses ({courses.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {course.code}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm font-medium text-green-700 mb-3">{course.department_name}</p>
              
              <div className="text-sm text-gray-500">
                Created by: {course.created_by_name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Department</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Department Code (e.g., CSE)"
                value={newDepartment.code}
                onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Description"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateDepartment}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowDeptModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Course</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Course Code (e.g., BTECH)"
                value={newCourse.code}
                onChange={(e) => setNewCourse({...newCourse, code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              <select
                value={newCourse.department}
                onChange={(e) => setNewCourse({...newCourse, department: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              
              <textarea
                placeholder="Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateCourse}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowCourseModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default PrincipalDepartments;