import { Edit, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

const DepartmentList = ({ departments, loading, onEdit, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No departments found</p>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{department.name}</td>
              <td className="py-3 px-4 text-gray-600">{department.code}</td>
              <td className="py-3 px-4 text-gray-600">{department.description || '-'}</td>
              <td className="py-3 px-4">
                <Button
                  onClick={() => onEdit(department)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentList;