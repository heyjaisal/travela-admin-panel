import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import AdminDashboardLayout from './Components/Navbar/Admin-layout';
import AdminHome from './Pages/Admin/Home';
import AllUsers from './Pages/Admin/AllUsers';
import AdminPayments from './Pages/Admin/Payment';
import AdminRequests from './Pages/Admin/Payment';
import AdminNotifications from './Pages/Admin/Notification';
import AdminMessages from './Pages/Admin/Messages';
import AdminCreate from './Pages/Admin/Create';
import AdminApproval from './Pages/Admin/Approval';
import AdminProfileSettings from './Pages/Admin/ProfileSettings';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard Routes */}
        <Route element={<AdminDashboardLayout />}>
          <Route path="/home" element={<AdminHome />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/requests" element={<AdminRequests />} />
          <Route path="/notifications" element={<AdminNotifications />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/create" element={<AdminCreate />} />
          <Route path="/approval" element={<AdminApproval />} />
          <Route path="/profile-settings" element={<AdminProfileSettings />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;