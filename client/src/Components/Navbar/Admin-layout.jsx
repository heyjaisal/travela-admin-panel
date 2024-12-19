import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "./Admin-navbar";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const AdminDashboardLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUserRole = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.role);
      console.log(userRole);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && !userRole) {
      fetchUserRole();
    }
  }, [token, fetchUserRole]);

  const memoizedFetchUserRole = useMemo(() => fetchUserRole, [fetchUserRole]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
        <div className="flex h-screen">
          <AdminNavbar role={userRole} />
          <div className="flex-1 p-1 overflow-auto bg-lightBg">
            <Outlet />
          </div>
        </div>
  );
};

export default AdminDashboardLayout;


