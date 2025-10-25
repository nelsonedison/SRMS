import React, { useState, useEffect } from 'react';
import { FileText, Plus, Eye, Trash2, Users, Calendar } from 'lucide-react';
import { useForm } from '../../hooks/form';
import { useDepartment } from '../../hooks/department';
import Toast from '../../components/static/Toast';

const PrincipalForms = () => {
  const { 
    listForms, 
    createForm, 
    deleteForm, 
    loading, 
    toast, 
    closeToast 
  } = useForm();
  
  const { departments, fetchDepartments } = useDepartment();
  
  const [forms, setForms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    department: '',
    fields: []
  });

  useEffect(() => {
    fetchForms();
    fetchDepartments();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await listForms();
      setForms(data.forms || []);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    }
  };

  const addField = (fieldType) => {
    const newField = {
      label: '',
      field_type: fieldType,
      is_required: false,
      placeholder: '',
      options: ['select', 'radio', 'checkbox'].includes(fieldType) ? [''] : [],
      order: newForm.fields.length + 1
    };
    setNewForm({
      ...newForm,
      fields: [...newForm.fields, newField]
    });
  };

  const updateField = (index, property, value) => {
    const updatedFields = [...newForm.fields];
    updatedFields[index][property] = value;
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const removeField = (index) => {
    const updatedFields = newForm.fields.filter((_, i) => i !== index);
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...newForm.fields];
    updatedFields[fieldIndex].options.push('');
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...newForm.fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const handleCreateForm = async () => {
    try {
      await createForm({
        ...newForm,
        department: parseInt(newForm.department)
      });
      setShowCreateModal(false);
      setNewForm({ title: '', description: '', department: '', fields: [] });
      fetchForms();
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(formId);
        fetchForms();
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
  };

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'textarea', label: 'Textarea', icon: '📄' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'date', label: 'Date', icon: '📅' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'radio', label: 'Radio Button', icon: '🔘' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'file', label: 'File Upload', icon: '📎' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Management</h1>
          <p className="text-gray-600 mt-1">Create and manage institutional forms</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Create Form Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Form
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  form.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{form.department_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{form.fields?.length || 0} fields</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>By {form.created_by_name}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`/forms/${form.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleDeleteForm(form.id)}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {forms.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No forms found</h3>
          <p className="text-gray-500">Create your first form to get started</p>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create New Form</h3>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Form Title"
                    value={newForm.title}
                    onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <select
                    value={newForm.department}
                    onChange={(e) => setNewForm({...newForm, department: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <textarea
                  placeholder="Form Description"
                  value={newForm.description}
                  onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                />

                {/* Field Builder */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h4>
                  
                  {/* Field Type Buttons */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
                    {fieldTypes.map((fieldType) => (
                      <button
                        key={fieldType.type}
                        onClick={() => addField(fieldType.type)}
                        className="flex flex-col items-center gap-1 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <span className="text-lg">{fieldType.icon}</span>
                        <span className="text-xs text-gray-600">{fieldType.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Field List */}
                  <div className="space-y-4">
                    {newForm.fields.map((field, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-700 capitalize">
                            {field.field_type} Field
                          </span>
                          <button
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Field Label"
                            value={field.label}
                            onChange={(e) => updateField(index, 'label', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Placeholder"
                            value={field.placeholder}
                            onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        
                        <label className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={field.is_required}
                            onChange={(e) => updateField(index, 'is_required', e.target.checked)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-600">Required field</span>
                        </label>

                        {/* Options for select, radio, checkbox */}
                        {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Options:</span>
                              <button
                                onClick={() => addOption(index)}
                                className="text-sm text-purple-600 hover:text-purple-700"
                              >
                                + Add Option
                              </button>
                            </div>
                            <div className="space-y-2">
                              {field.options.map((option, optIndex) => (
                                <input
                                  key={optIndex}
                                  type="text"
                                  placeholder={`Option ${optIndex + 1}`}
                                  value={option}
                                  onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCreateForm}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Form'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default PrincipalForms;