import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./utils/axios-instance";
import { ScaleLoader } from "react-spinners";

import { setUserInfo, setAllowedPages } from "./redux/slice/auth";
import ProtectedRoute from "./utils/Protectedroutes";

const AdminDashboardLayout = lazy(() => import("./Components/Navbar/Navbar-layout"));
const LoginPage = lazy(() => import("./Pages/Login"));
const HomePage = lazy(() => import("./Pages/Dashboard"));
const PaymentsPage = lazy(() => import("./Pages/Payment"));
const UsersPage = lazy(() => import("./Pages/Allusers"));
const UserDetails = lazy(() => import("./app/user"));
const NotificationsPage = lazy(() => import("./Pages/Notification"));
const Create = lazy(() => import("./app/all-admin"));
const ProfilePage = lazy(() => import("./Pages/ProfileSettings"));
const Message = lazy(() => import("./Pages/Messages"));
const Approval = lazy(() => import("./Pages/Approval"));
const HostDetails = lazy(() => import("./app/host"));
const PropertyDetails = lazy(() => import("./app/property"));
const EventDetails = lazy(() => import("./app/event"));
const BlogDetails = lazy(() => import("./app/blog"));
const PropertyPage = lazy(() => import("./app/property-page"));
const EventPage = lazy(() => import("./app/event-page"));

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
        const response = await axiosInstance.get("/auth/admin-data", { withCredentials: true });
        if (response.status === 200) {
          const { user } = response.data;
          dispatch(setUserInfo(user));
          dispatch(setAllowedPages(user.allowedPages || []));
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [dispatch, navigate]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" aria-label="loading" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <ScaleLoader color="#C0C2C9" />
        </div>
      }
    >
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

          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
        </Route>

        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
      </Routes>
    </Suspense>
  );
};

export default App;
