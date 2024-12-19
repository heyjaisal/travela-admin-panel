import React, { useState, useEffect } from "react";
import axios from "axios";

function Allusers() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResp = await axios.get("http://localhost:5000/api/get-user");
        setUsers(Array.isArray(userResp.data) ? userResp.data : []);

        const hostResp = await axios.get("http://localhost:5000/api/get-host");
        setHosts(Array.isArray(hostResp.data) ? hostResp.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsers([]);
        setHosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderTableRows = (data) =>
    data.map((user) => (
      <tr
        key={user._id}
        className="border-b hover:bg-gray-100 transition-colors"
      >
        {/* Profile Picture */}
        <td className="p-4">
          <div className="flex items-center">
            <img
              src={user.profileImage || "/images/no-profile-picture.jpg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3 text-gray-800 font-medium">{user.name}</div>
          </div>
        </td>
        {/* Email */}
        <td className="p-4 text-gray-600">{user.email}</td>
        {/* Country */}
        <td className="p-4 text-gray-600">{user.country || "N/A"}</td>
        {/* Action Buttons */}
        <td className="p-4">
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              Edit
            </button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Users</h1>
        <input
          type="text"
          placeholder="Search"
          className="py-2 px-4 w-64 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Tab Buttons */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`py-2 px-6 font-medium border-b-4 ${
            activeTab === "users"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600 hover:text-purple-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("hosts")}
          className={`py-2 px-6 font-medium border-b-4 ${
            activeTab === "hosts"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600 hover:text-purple-600"
          }`}
        >
          Hosts
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-4 text-left">Profile</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Country</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "users" && users.length > 0
                ? renderTableRows(users)
                : activeTab === "hosts" && hosts.length > 0
                ? renderTableRows(hosts)
                : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Allusers;
