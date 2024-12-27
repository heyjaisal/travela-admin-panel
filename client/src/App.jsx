import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ClipLoader } from "react-spinners"; 
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/dashboards";
import PaymentsPage from "./Pages/Payment";
import UsersPage from "./Pages/Allusers";
import RequestsPage from "./Pages/Request";
import NotificationsPage from "./Pages/Notification";
import Create from "./Pages/createadmin";
import ProfilePage from "./Pages/ProfileSettings";
import Message from "./Pages/Messages";
import Approval from "./Pages/Approval";
import AdminDashboardLayout from "./Components/Navbar/Admin-layout";
import PrivateRoute from "./Components/utils/Protectedroutes";

const App = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setTimeout(() => setLoading(false), 500); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#3498db" loading={loading} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<AdminDashboardLayout />}>
          <Route
            path="home"
            element={<PrivateRoute allowedRoles={['superadmin', 'financeadmin', 'useradmin', 'approver', 'subadmin']}><HomePage /></PrivateRoute>}
          />
          <Route
            path="notifications"
            element={<PrivateRoute allowedRoles={['superadmin', 'financeadmin', 'useradmin', 'approver', 'subadmin']}><NotificationsPage /></PrivateRoute>}
          />
          <Route
            path="profile"
            element={<PrivateRoute allowedRoles={['superadmin', 'financeadmin', 'useradmin', 'approver', 'subadmin']}><ProfilePage /></PrivateRoute>}
          />
          <Route
            path="messages"
            element={<PrivateRoute allowedRoles={['superadmin', 'financeadmin', 'useradmin', 'approver', 'subadmin']}><Message /></PrivateRoute>}
          />
          <Route
            path="payments"
            element={<PrivateRoute allowedRoles={['superadmin', 'financeadmin']}><PaymentsPage /></PrivateRoute>}
          />
          <Route
            path="all-users"
            element={<PrivateRoute allowedRoles={['superadmin', 'useradmin', 'approver', 'subadmin']}><UsersPage /></PrivateRoute>}
          />
          <Route
            path="requests"
            element={<PrivateRoute allowedRoles={['superadmin', 'useradmin', 'approver', 'subadmin']}><RequestsPage /></PrivateRoute>}
          />
          <Route
            path="approval"
            element={<PrivateRoute allowedRoles={['superadmin', 'approver']}><Approval /></PrivateRoute>}
          />
          <Route
            path="create"
            element={<PrivateRoute allowedRoles={['superadmin']}><Create /></PrivateRoute>}
          />
        </Route>

        {/* Fallback for Unauthorized Access */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
