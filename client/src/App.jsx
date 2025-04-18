import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./utils/axios-instance";
import { ScaleLoader } from "react-spinners";

import { setUserInfo, setAllowedPages } from "./redux/slice/auth";
import ProtectedRoute from "./utils/Protectedroutes";
import AdminDashboardLayout from "./Components/Navbar/Navbar-layout";
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/Dashboard";
import PaymentsPage from "./Pages/Payment";
import UsersPage from "./Pages/Allusers";
import UserDetails from "./app/user";
import NotificationsPage from "./Pages/Notification";
import Create from "./app/all-admin";
import ProfilePage from "./Pages/ProfileSettings";
import Message from "./Pages/Messages";
import Approval from "./Pages/Approval";
import HostDetails from "./app/host";

const pages = {
  home: HomePage,
  notifications: NotificationsPage,
  profile: ProfilePage,
  messages: Message,
  payments: PaymentsPage,
  "all-users": UsersPage,
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
        const response = await axiosInstance.get("/admin/admin-data", { withCredentials: true });
        if (response.status === 200) {
          const { user } = response.data;
          dispatch(setUserInfo(user));
          dispatch(setAllowedPages(user.allowedPages || []));
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        navigate("/error"); // Redirect to an error page if needed
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [dispatch, navigate, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" aria-label="loading" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <AdminDashboardLayout /> : <LoginPage />}>
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
        {allowedPages.includes("all-users") && (
          <>
            {["user", "host"].map((type) => (
              <Route
                key={type}
                path={`/all-users/${type}/:id`}
                element={
                  <ProtectedRoute permission="all-users">
                    {type === "user" ? <UserDetails /> : <HostDetails />}
                  </ProtectedRoute>
                }
              />
            ))}
          </>
        )}
      </Route>

      <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
    </Routes>
  );
};

export default App;