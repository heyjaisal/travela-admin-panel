import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [activeTab, setActiveTab] = useState("approval");

  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const logout = () => {
    localStorage.removeItem("token");
    navigate('/')
  };
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);
  return (
    <div>
      <div className="container">
        <div className="flex justify-between items-ceter mb-2">
          <h1 className="text-xl pl-3.5 pt-2 font-bold font-sans">Settings</h1>
          <input
            type="text"
            placeholder="Search"
            className="py-2 my-2 mr-3 px-1 rounded-lg
         text-center border border-gray-300 w-48"
          />
        </div>
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab("approval")}
            className={`py-2 px-4 text-lg font-poppins border-b-4 ${
              activeTab === "approval"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600"
            }`}
          >
            {" "}
            Profile
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`py-2 px-4 text-lg font-poppins border-b-4 ${
              activeTab === "report"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600"
            }`}
          >
            Settings
          </button>
        </div>
      </div>
      <div>
        <button onClick={logout} className="p-4 m-5 bg-red-600 text-white">
          logout
        </button>
      </div>
    </div>
  );
}
export default Profile;
