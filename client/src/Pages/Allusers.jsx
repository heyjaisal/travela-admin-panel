import React, { useState } from 'react';
import Users from "../listing/all-users";
import Host from "../listing/all-host";
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const Account = () => {
  const [activeTab, setActiveTab] = useState("user");

  const navigate = useNavigate(); 

  const handleClose = () => {
    navigate("/home");
  };

  return ( 
    <div className="p-4 bg-lightBg overflow-hidden">
      <h1 className="text-xl pl-3.5 pt-2 font-bold">All user</h1>

      <div className="flex mb-4 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab("user")}
          className={`py-2 px-4 text-lg ${activeTab === "user" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("host")}
          className={`py-2 px-4 text-lg ${activeTab === "host" ? "border-b-4 border-purple-600 text-purple-600" : "text-gray-600"}`}
        >
          Host
        </button>
      </div>
      <button onClick={handleClose} className="absolute top-4 right-4 text-gray-700">
        <X className="w-6 h-6" />
      </button>

      {activeTab === "user" ? <Users /> : <Host />}
    </div>
  );
};

export default Account;