// Profile.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";  // Import useDispatch from react-redux
import { logout } from "../redux/actions/authaction";  // Import logout action

function Profile() {
  const [activeTab, setActiveTab] = useState("approval");

  const navigate = useNavigate();
  const dispatch = useDispatch();  // Initialize dispatch to dispatch the logout action

  const handleLogout = () => {
    // Dispatch the logout action to update the Redux state
    dispatch(logout());

    // Remove token from localStorage
    localStorage.removeItem("token");

    // Navigate to the login page
    navigate("/", { replace: true });
  };

  return (
    <div>
      <div className="container">
        <div className="flex justify-between items-ceter mb-2">
          <h1 className="text-xl pl-3.5 pt-2 font-bold font-sans">Settings</h1>
          <input
            type="text"
            placeholder="Search"
            className="py-2 my-2 mr-3 px-1 rounded-lg text-center border border-gray-300 w-48"
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
        <button onClick={handleLogout} className="p-4 m-5 bg-red-600 text-white">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
