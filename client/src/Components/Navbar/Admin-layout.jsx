import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./Admin-navbar";
import { useSelector } from "react-redux"; 

const AdminDashboardLayout = () => {
  const role = useSelector((state) => state.auth.role); 

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
