import React, { useState, useEffect } from 'react';
import { FileText, Plus, Eye, ToggleLeft, ToggleRight, Calendar, Users } from 'lucide-react';
import { useForm } from '../../hooks/form';
import { useAuth } from '../../hooks/auth';
import Toast from '../../components/static/Toast';

const HodForms = () => {
  const { 
    listForms, 
    createForm, 
    updateForm, 
    loading, 
    toast, 
    closeToast 
  } = useForm();
  
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    department: user?.department_id || '',
    fields: []
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await listForms(user?.department_id);
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
      await createForm(newForm);
      setShowCreateModal(false);
      setNewForm({ title: '', description: '', department: user?.department_id || '', fields: [] });
      fetchForms();
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      await updateForm(formId, { is_active: !currentStatus });
      fetchForms();
    } catch (error) {
      console.error('Failed to update form status:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Department Forms</h1>
          <p className="text-gray-600 mt-1">Create and manage forms for your department</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Create Form Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 font-medium"
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
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => toggleFormStatus(form.id, form.is_active)}
                  className="flex items-center gap-1"
                >
                  {form.is_active ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{form.fields?.length || 0} fields</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>By {form.created_by_name}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  form.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </span>
                
                <button
                  onClick={() => window.open(`/forms/${form.id}`, '_blank')}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
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
          <p className="text-gray-500">Create your first department form to get started</p>
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
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Form Title"
                    value={newForm.title}
                    onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  
                  <textarea
                    placeholder="Form Description"
                    value={newForm.description}
                    onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

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
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Field Label"
                            value={field.label}
                            onChange={(e) => updateField(index, 'label', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Placeholder"
                            value={field.placeholder}
                            onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        
                        <label className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={field.is_required}
                            onChange={(e) => updateField(index, 'is_required', e.target.checked)}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
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
                                className="text-sm text-teal-600 hover:text-teal-700"
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
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 font-medium disabled:opacity-50"
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

export default HodForms;