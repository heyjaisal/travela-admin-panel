import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Profile from '@/app/profile';

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const navigate = useNavigate(); 

  const handleClose = () => {
    navigate("/");
  };

  return ( 
     <Profile /> 
  
  );
};

export default Account;