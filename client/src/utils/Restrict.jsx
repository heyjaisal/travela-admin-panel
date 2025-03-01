import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ToggleUser = ({ userId, userType, currentStatus, onSuccess }) => {
  const handleToggleUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/auth/change-restrict/${userId}`, { type: userType }, { withCredentials: true });
      
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success(`User ${currentStatus === 'Restricted' ? 'unrestricted' : 'restricted'} successfully!`);
    } catch (error) {
      console.error('Error toggling user restriction:', error);
      toast.error('Failed to toggle user restriction. Please try again.');
    }
  };

  return (
    <button 
    onClick={handleToggleUser } 
    className={`text-${currentStatus === 'Restricted' ? 'green' : 'green'} hover:text-${currentStatus === 'Restricted' ? 'red' : 'green'}-700`}
  >
    {currentStatus === 'Restricted' ? 'Unrestrict User' : 'Restrict User'}
  </button>
  );
};

export default ToggleUser;