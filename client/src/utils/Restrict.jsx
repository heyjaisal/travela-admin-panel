import React from 'react';
import axiosInstance from '../utils/axios-instance';
import { toast } from 'react-toastify';

const ToggleUser = ({ userId, userType, currentStatus, onSuccess }) => {
  const handleToggleUser = async () => {
    try {
      await axiosInstance.put(`/auth/change-restrict/${userId}`, { type: userType }, { withCredentials: true });
      
      
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