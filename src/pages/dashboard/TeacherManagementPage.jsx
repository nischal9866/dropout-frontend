import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';

const TeacherManagementPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    employee_id: '',
    qualification: '',
    department: '',
    subjects_taught: '',
    password: '' // Add password field
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('accounts/admin/teachers/');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await axios.put(`accounts/admin/teachers/${editingTeacher.id}/update/`, formData);
        toast.success('Teacher updated successfully');
        fetchTeachers();
        closeModal();
      } else {
        // For new teacher, send the password along with other data
        const response = await axios.post('accounts/admin/teachers/create/', formData);
        
        // Show password modal with generated password
        if (response.data.generated_password) {
          setNewTeacherPassword(response.data.generated_password);
          setNewTeacherName(`${formData.first_name} ${formData.last_name}`);
          setShowPasswordModal(true);
        }
        
        toast.success('Teacher created successfully');
        fetchTeachers();
        closeModal();
      }
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.values(errors).forEach(err => toast.error(err));
      } else {
        toast.error('Failed to save teacher');
      }
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`accounts/admin/teachers/${teacherId}/delete/`);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const openModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        username: teacher.username,
        email: teacher.email,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        phone_number: teacher.phone_number,
        employee_id: teacher.employee_id,
        qualification: teacher.qualification,
        department: teacher.department || '',
        subjects_taught: teacher.subjects_taught || '',
        password: ''
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        employee_id: '',
        qualification: '',
        department: '',
        subjects_taught: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Password copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Manage all teacher accounts</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {teacher.first_name?.charAt(0) || teacher.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {teacher.first_name} {teacher.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">@{teacher.username}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(teacher)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Email:</span>
                <span className="text-gray-600">{teacher.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Employee ID:</span>
                <span className="text-gray-600">{teacher.employee_id}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Phone:</span>
                <span className="text-gray-600">{teacher.phone_number}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Qualification:</span>
                <span className="text-gray-600">{teacher.qualification}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Department:</span>
                <span className="text-gray-600">{teacher.department || 'Not assigned'}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                teacher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {teacher.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No teachers found. Click "Add Teacher" to create one.</p>
        </div>
      )}

      {/* Create/Edit Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects Taught
                  </label>
                  <textarea
                    name="subjects_taught"
                    value={formData.subjects_taught}
                    onChange={handleChange}
                    rows="2"
                    className="input-field"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                </div>

                {!editingTeacher && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password (Optional)
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Leave empty to auto-generate"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If left empty, a random password will be generated and shown after creation.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Display Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Teacher Account Created!</h3>
                <p className="text-gray-600">
                  Teacher <span className="font-semibold">{newTeacherName}</span> has been created successfully.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Login Credentials:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Username:</p>
                    <p className="font-mono text-sm font-semibold">{formData.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Password:</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-sm font-semibold">{newTeacherPassword}</p>
                      <button
                        onClick={() => copyToClipboard(newTeacherPassword)}
                        className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        <ClipboardIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  ⚠️ Please save these credentials and share them with the teacher securely.
                  The teacher should change their password after first login.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewTeacherPassword('');
                  setNewTeacherName('');
                }}
                className="btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagementPage;