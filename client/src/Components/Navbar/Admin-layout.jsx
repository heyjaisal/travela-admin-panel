import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AdminNavbar from "./Admin-navbar"; 

const AdminDashboardLayout = () => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);


  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (
    role !== "superadmin" &&
    role !== "useradmin" &&
    role !== "marketingadmin" &&
    role !== "financeadmin"
  ) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="flex h-screen">
      <AdminNavbar role={role} />
      <div className="flex-1 overflow-auto bg-lightBg">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
