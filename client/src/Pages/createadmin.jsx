import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    position: '',
    mobile: '', 
  });

  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-admin');
        console.log('Admins data:', response.data);
        setAdmins(response.data || []);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to fetch admins');
      }
    };
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (!formData.position) {
      setError('Position is required');
      return;
    }

    if (!formData.mobile) {
      setError('Mobile number is required');
      return;
    }

    if (!formData.role) {
      setError('Role is required');
      return;
    }

    try {
      const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
      };

      const response = await axios.post('http://localhost:5000/api/create-admin', formData, getAuthHeaders());
      setAdmins([...admins, response.data.admin]);
      setSuccess('Admin created successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        position: '',
        mobile: '',
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Edit
  const handleEdit = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      position: admin.position,
      mobile: admin.mobile,
    });
  };

  // Handle Delete
  const handleDelete = async (adminId) => {
    try {
      const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
      };

      await axios.delete(`http://localhost:5000/api/delete-admin/${adminId}`, getAuthHeaders());
      setAdmins(admins.filter((admin) => admin._id !== adminId));
      setSuccess('Admin deleted successfully');
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong while deleting');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-2 bg-gray-100 min-h-screen">
      {/* Admin Form Card */}
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-2 flex flex-col space-y-3">
        <h2 className="text-2xl font-semibold text-gray-800">Create Admin</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="useradmin">User Admin</option>
              <option value="marketingadmin">Marketing Admin</option>
              <option value="financeadmin">Finance Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
          >
            Create Admin
          </button>
        </form>
      </div>

      {/* Admin List Card */}
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admins</h2>
        <div className="space-y-6">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <div key={admin._id} className="flex items-center space-x-4 p-4 border rounded-md shadow-sm">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.role}</p>
                  <p className="text-sm text-gray-500">{admin.position}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                  <p className="text-sm text-gray-500">{admin.mobile}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No admins available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
