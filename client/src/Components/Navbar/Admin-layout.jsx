import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./Admin-navbar";
import { useSelector } from "react-redux"; // Use Redux to get role

const AdminDashboardLayout = () => {
  const role = useSelector((state) => state.auth.role); // Access role from Redux

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
