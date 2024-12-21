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

    if (!formData.name ) {
      setError('name is required');
      return;
    }

    if ( !formData.email ) {
      setError('email is required');
      return;
    }

    if ( !formData.password ) {
      setError('password is required');
      return;
    }
    if ( !formData.position ) {
      setError('postion is required');
      return;
    } 
    if ( !formData.mobile ) {
      setError('mobile number is required');
      return;
    }
    if ( !formData.role ) {
      setError('role is required');
      return;
    }


    try {
      const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
          headers: { Authorization: `Bearer ${token}` },
        };
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
        const token = localStorage.getItem("token");
        return {
          headers: { Authorization: `Bearer ${token}` },
        };
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
    <div className="flex flex-col md:flex-row gap-6 p-2">
      {/* Admin Form Card */}
      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-2">
        <h2 className="text-xl font-bold mb-4">Create Admin</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded px-3 py-2 hover:bg-blue-600"
          >
            Create Admin
          </button>
        </form>
      </div>

      {/* Admin List Card */}
      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-2">
        <h2 className="text-xl font-bold mb-4">Admins</h2>
        <div className="space-y-4">
          {admins && admins.length > 0 ? (
            admins.map((admin) => (
              <div key={admin._id} className="flex items-center space-x-4 p-3 border rounded">
                <div>
                  <p className="text-lg font-bold">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.role}</p>
                  <p className="text-sm text-gray-500">{admin.position}</p>
                  <p className="text-sm text-gray-500">{admin.personalEmail}</p>
                  <p className="text-sm text-gray-500">{admin.mobile}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
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