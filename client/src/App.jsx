import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./utils/axios-instance";
import { ScaleLoader } from "react-spinners";

import { setUserInfo, setAllowedPages } from "./redux/slice/auth";
import ProtectedRoute from "./utils/Protectedroutes";

// Lazy-loaded pages
const AdminDashboardLayout = lazy(() => import("./Components/Navbar/Navbar-layout"));
const LoginPage = lazy(() => import("./Pages/Login"));
const HomePage = lazy(() => import("./Pages/Dashboard"));
const UsersPage = lazy(() => import("./Pages/Allusers"));
const UserDetails = lazy(() => import("./app/user"));
const HostDetails = lazy(() => import("./app/host"));
const NotificationsPage = lazy(() => import("./Pages/Notification"));
const Create = lazy(() => import("./listing/all-admin"));
const ProfilePage = lazy(() => import("./Pages/ProfileSettings"));
const Message = lazy(() => import("./Pages/Messages"));
const Approval = lazy(() => import("./Pages/Approval"));
const PropertyDetails = lazy(() => import("./property/property"));
const EventDetails = lazy(() => import("./event/event"));
const BlogDetails = lazy(() => import("./app/blog"));
const Content = lazy(() => import("./app/Content"));
const PropertyPage = lazy(() => import("./property/property-page"));
const EventPage = lazy(() => import("./event/event-page"));

const pages = {
  home: HomePage,
  notifications: NotificationsPage,
  profile: ProfilePage,
  messages: Message,
  "all-users": UsersPage,
  approval: Approval,
  create: Create,
  settings: Content,
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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
  }, [dispatch]);

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
        <Route
          path="/"
          element={user ? <AdminDashboardLayout /> : <LoginPage />}
        >

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
              <Route
                path="/all-users/user/:id"
                element={
                  <ProtectedRoute permission="all-users">
                    <UserDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/all-users/host/:id"
                element={
                  <ProtectedRoute permission="all-users">
                    <HostDetails />
                  </ProtectedRoute>
                }
              />
            </>
          )}
       
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
        </Route>
      
        <Route path="/settings" element={<Content />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />

        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
