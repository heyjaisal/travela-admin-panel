import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

import { setUserInfo, setAllowedPages } from "./redux/slice/auth";
import ProtectedRoute from "./utils/Protectedroutes";
import AdminDashboardLayout from "./Components/Navbar/Navbar-layout";
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/dashboards";
import PaymentsPage from "./Pages/Payment";
import UsersPage from "./Pages/Allusers";
import RequestsPage from "./Pages/Request";
import NotificationsPage from "./Pages/Notification";
import Create from "./app/all-admin";
import ProfilePage from "./Pages/ProfileSettings";
import Message from "./Pages/Messages";
import Approval from "./Pages/Approval";

const pages = {
  home: HomePage,
  notifications: NotificationsPage,
  profile: ProfilePage,
  messages: Message,
  payments: PaymentsPage,
  "all-users": UsersPage,
  requests: RequestsPage,
  approval: Approval,
  create: Create,
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.userInfo);
  const allowedPages = useSelector((state) => state.auth.allowedPages) || [];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/admin-data", { withCredentials: true });
        if (response.status === 200) {
          dispatch(setUserInfo(response.data.user));
          dispatch(setAllowedPages(response.data.user.allowedPages || []));
          navigate("/home");
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" aria-label="loading" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <LoginPage />} />
      <Route path="/" element={user ? <AdminDashboardLayout /> : <Navigate to="/" />}>
        {allowedPages.map((page) =>
          pages[page] ? (
            <Route
              key={page}
              path={`/${page}`}
              element={
                <ProtectedRoute permission={page}>
                  {React.createElement(pages[page])}
                </ProtectedRoute>
              }
            />
          ) : null
        )}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
