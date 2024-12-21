import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaDollarSign,
  FaBell,
  FaEnvelope,
  FaPlus,
  FaCheckCircle,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";

const AdminNavbar = () => {
  // Access the role from Redux state
  const role = useSelector((state) => state.auth.role); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Check for specific roles
  const isFinanceAdmin = role === "financeadmin";
  const isSuperAdmin = role === "superadmin";
  const isUserAdmin = role === "useradmin";
  const isMarketingAdmin = role === "marketingadmin";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg- text-slate-800 h-full">
        <div className="flex items-center justify-center h-20 border-b">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          {(isSuperAdmin || isMarketingAdmin) && (
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
            >
              <FaHome />
              Home
            </NavLink>
          )}
          {(isSuperAdmin || isUserAdmin) && (
            <NavLink
              to="/all-users"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
            >
              <FaUsers />
              All Users
            </NavLink>
          )}
          {(isSuperAdmin || isFinanceAdmin) && (
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
            >
              <FaDollarSign />
              Payments
            </NavLink>
          )}
          {(isSuperAdmin || isUserAdmin) && (
            <NavLink
              to="/requests"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
            >
              <FaClipboardList />
              Requests
            </NavLink>
          )}

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaBell />
            Notifications
          </NavLink>
          
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaEnvelope />
            Messages
          </NavLink>
          {isSuperAdmin && (
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
            >
              <FaPlus />
              Create
            </NavLink>
          )}
          {(isSuperAdmin || isUserAdmin) && (
            <NavLink
              to="/approval"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
            >
              <FaCheckCircle />
              Approval
            </NavLink>
          )}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl ${
                isActive ? "bg-blue-600 text-white" : ""
              }`
            }
          >
            <FaUser />
            Profile
          </NavLink>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white shadow-lg border-t">
        <nav className="flex justify-around p-2 text-slate-800">
          <button
            onClick={toggleSidebar}
            className="flex flex-col items-center gap-1"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            <span className="text-xs">Menu</span>
          </button>
          {(isSuperAdmin || isFinanceAdmin) && (
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 ${
                  isActive ? "text-blue-500" : ""
                }`
              }
            >
              <FaDollarSign size={20} />
              <span className="text-xs">Payments</span>
            </NavLink>
          )}
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1  ${
                isActive ? "text-blue-500" : ""
              }`
            }
          >
            <FaUser size={20} />
            <span className="text-xs">Messages</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1  ${
                isActive ? "text-blue-500" : ""
              }`
            }
          >
            <FaUser size={20} />
            <span className="text-xs">Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
          <div className="fixed inset-y-0 left-0 bg-white w-64 z-50 shadow-lg flex flex-col">
            <div className="flex items-center justify-center h-20 border-b">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <nav className="flex-1 p-4 space-y-4">
            {(isSuperAdmin || isMarketingAdmin) && (
                <NavLink
                  to="/home"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-xl ${
                      isActive ? "bg-blue-600 text-white" : ""
                    }`
                  }
                >
                  <FaHome />
                  Home
                </NavLink>
              )}
              {(isSuperAdmin || isUserAdmin) && (
              <NavLink
                to="/all-users"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaUsers />
                All Users
              </NavLink>
              )}

{(isSuperAdmin || isFinanceAdmin) && (
                <NavLink
                  to="/payments"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-xl ${
                      isActive ? "bg-blue-600 text-white" : ""
                    }`
                  }
                >
                  <FaDollarSign />
                  Payments
                </NavLink>
              )}
              {(isSuperAdmin || isUserAdmin) && (
              <NavLink
                to="/requests"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaClipboardList />
                Requests
              </NavLink>
              )}
              <NavLink
                to="/notifications"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaBell />
                Notifications
              </NavLink>
              <NavLink
                to="/messages"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaEnvelope />
                Messages
              </NavLink>
              {isSuperAdmin  && (
                <NavLink
                  to="/create"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-xl ${
                      isActive ? "bg-blue-600 text-white" : ""
                    }`
                  }
                >
                  <FaPlus />
                  Create
                </NavLink>
              )}

              {(isSuperAdmin || isUserAdmin) && (
              <NavLink
                to="/approval"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaCheckCircle />
                Approval
              </NavLink>
              )}
              <NavLink
                to="/profile"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
              >
                <FaUser />
                Profile
              </NavLink>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default AdminNavbar;

