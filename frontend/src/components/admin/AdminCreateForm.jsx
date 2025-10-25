import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from '../../hooks/form';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Toast from '../static/Toast';

const CreateForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    fields: []
  });
  const [departments, setDepartments] = useState([]);
  const { createForm, loading, toast, closeToast } = useForm();

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      setDepartments([{id: 1, name: 'Computer Science'}, {id: 2, name: 'Electronics'}]); // Mock data
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createForm(formData);
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', department: '', fields: [] });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addField = (fieldType) => {
    const newField = {
      label: '',
      field_type: fieldType,
      is_required: false,
      placeholder: '',
      options: ['select', 'radio', 'checkbox'].includes(fieldType) ? [''] : [],
      order: formData.fields.length + 1
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index, property, value) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][property] = value;
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  const removeField = (index) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...formData.fields];
    updatedFields[fieldIndex].options.push('');
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formData.fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formData.fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Form" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter form title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter form description"
          />
        </div>

        {/* Field Builder */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Form Fields
            </label>
            <div className="flex gap-1 flex-wrap">
              {['text', 'textarea', 'number', 'email', 'date', 'select', 'radio', 'checkbox', 'file'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addField(type)}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {formData.fields.map((field, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-600">{field.field_type}</span>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Field Label"
                    value={field.label}
                    onChange={(e) => updateField(index, 'label', e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  {!['date', 'file'].includes(field.field_type) && (
                    <input
                      type="text"
                      placeholder="Placeholder"
                      value={field.placeholder}
                      onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  )}
                </div>
                
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) => updateField(index, 'is_required', e.target.checked)}
                    className="mr-2"
                  />
                  Required
                </label>
                
                {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Options:</span>
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Option
                      </button>
                    </div>
                    {field.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-1 mb-1">
                        <input
                          type="text"
                          placeholder="Option text"
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index, optionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {formData.fields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No fields added yet. Click on field types above to add fields.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={!formData.title}
            className="flex-1"
          >
            Create Form
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
      {toast && <Toast {...toast} onClose={closeToast} />}
    </Modal>
  );
};

export default CreateForm;