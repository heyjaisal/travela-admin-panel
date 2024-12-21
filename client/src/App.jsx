import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import AdminDashboardLayout from "./Components/Navbar/Admin-layout";
import AllUsers from "./Pages/Admin/AllUsers";
import AdminPayments from "./Pages/Admin/Payment";
import AdminRequests from "./Pages/Admin/Payment";
import AdminNotifications from "./Pages/Admin/Notification";
import AdminMessages from "./Pages/Admin/Messages";
import AdminCreate from "./Pages/Admin/Create";
import AdminApproval from "./Pages/Admin/Approval";
import AdminProfileSettings from "./Pages/Admin/ProfileSettings";
import Dashboard from "./Pages/Admin/Dashboard";
import RoleBasedRoute from "./Components/utils/Protectedroutes"; 

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login />} />

        <Route element={<AdminDashboardLayout />}>
          <Route
            path="/home"
            element={
              <RoleBasedRoute allowedRoles={["superadmin", "marketingadmin"]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/all-users"
            element={
              <RoleBasedRoute allowedRoles={["superadmin", "useradmin"]}>
                <AllUsers />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <RoleBasedRoute allowedRoles={["superadmin", "financeadmin"]}>
                <AdminPayments />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <RoleBasedRoute allowedRoles={["superadmin", "useradmin"]}>
                <AdminRequests />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <RoleBasedRoute
                allowedRoles={["superadmin", "marketingadmin", "useradmin",'financeadmin']}
              >
                <AdminNotifications />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <RoleBasedRoute
                allowedRoles={["superadmin", "financeadmin", "useradmin",'marketingadmin']}
              >
                <AdminMessages />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <RoleBasedRoute allowedRoles={["superadmin"]}>
                <AdminCreate />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/approval"
            element={
              <RoleBasedRoute allowedRoles={["superadmin", "useradmin"]}>
                <AdminApproval />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <RoleBasedRoute
                allowedRoles={[
                  "superadmin",
                  "useradmin",
                  "marketingadmin",
                  "financeadmin",
                ]}
              >
                <AdminProfileSettings />
              </RoleBasedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
