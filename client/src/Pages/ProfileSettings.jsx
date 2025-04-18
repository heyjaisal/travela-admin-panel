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
    <div className="p-4 bg-lightBg overflow-hidden">
      <h1 className="text-xl pl-3.5 pt-2 font-bold">Account</h1>

      <div className="flex mb-4 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-2 px-4 text-lg ${activeTab === "profile" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-2 px-4 text-lg ${activeTab === "settings" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Settings
        </button>
      </div>
      <button onClick={handleClose} className="absolute top-4 right-4 text-gray-700">
        <X className="w-6 h-6" />
      </button>

      {activeTab === "profile" ? <Profile /> :<>hey</> }
    </div>
  );
};

export default Account;