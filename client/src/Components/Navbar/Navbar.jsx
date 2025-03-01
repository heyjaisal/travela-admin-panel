import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  FileText,
  MessageCircle,
  Plus,
  Menu,
  X,
  Wallet,
  Settings,
  MessagesSquare,
  Bell,
  ClipboardList,
  CalendarDays,
  User,
} from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import logo from "../../assets/logo.png";

const allRoutes = [
  { to: "/home", icon: Home, text: "Home", permission: "home" },
  { to: "/messages", icon: MessagesSquare, text: "Messages", permission: "messages" },
  { to: "/create", icon: Plus, text: "Create", permission: "create" },
  { to: "/payments", icon: Wallet, text: "Payments", permission: "payments" },
  { to: "/all-users", icon: ClipboardList, text: "All Users", permission: "all-users" },
  { to: "/requests", icon: FileText, text: "Requests", permission: "requests" },
  { to: "/approval", icon: CalendarDays, text: "Approval", permission: "approval" },
  { to: "/notifications", icon: Bell, text: "Notifications", permission: "notifications" },
  { to: "/profile", icon: User, text: "Profile", permission: "profile" },
];

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const allowedPages = useSelector((state) => state.auth.allowedPages);

  const filteredRoutes = allRoutes.filter((route) =>
    allowedPages.includes(route.permission)
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <MobileNavbar routes={filteredRoutes} />
  ) : (
    <DesktopSidebar routes={filteredRoutes} />
  );
}

function MobileNavbar({ routes }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userinfo = useSelector((state) => state.auth.userInfo);
  const image = userinfo?.image || null;
  const firstName = userinfo?.firstName || "";
  const email = userinfo?.email || "";

  const handleNavClick = () => setIsOpen(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-lightBg text-black flex items-center justify-between px-4 py-3 shadow-sm z-50">
        <Menu className="text-2xl cursor-pointer" onClick={() => setIsOpen(true)} />
        <img src={logo} alt="logo" className="w-5 h-5 ml-11" />
        <div className="flex items-center gap-4">
          <Plus onClick={() => navigate("/create")} className="text-xl cursor-pointer" />
          <Avatar className="h-7 w-7 cursor-pointer" onClick={() => navigate("/profile")}>
            {image ? (
              <AvatarImage src={image} alt="Profile" className="w-full h-full" />
            ) : (
              <div className="uppercase h-7 w-7 flex items-center justify-center border">
                {(firstName || email)?.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex z-50">
          <div className="w-64 bg-lightBg h-full p-4 flex flex-col gap-4 text-black">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Travela</h2>
              <X className="text-2xl cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <nav className="flex flex-col gap-4">
              {routes.map(({ to, icon: Icon, text }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition hover:text-white"
                  onClick={handleNavClick}
                >
                  <Icon className="w-5 h-5" />
                  <span>{text}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function DesktopSidebar({ routes }) {
  const userinfo = useSelector((state) => state.auth.userInfo);
  const [image, setImage] = useState(userinfo?.image || null);
  const [firstName, setFirstName] = useState(userinfo?.firstName || "");
  const [email, setEmail] = useState(userinfo?.email || "");
  const [isHovered, setIsHovered] = useState(false);

  const firstNameInitial = firstName.charAt(0) || email.charAt(0) || "";

  return (
    <div
      className={`hidden md:flex flex-col ${
        isHovered ? "w-64" : "w-18"
      } text-slate-800 h-full transition-all duration-300 top-0 sticky z-10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink to="/profile">
        <div className="flex items-center gap-4 p-3 pt-6 pb-6 pl-4 border-b">
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="uppercase h-full w-full text-3xl flex items-center justify-center border">
                {firstNameInitial}
              </div>
            )}
          </Avatar>
          {isHovered && (
            <h1 className="text-2xl font-title font-bold">Travela</h1>
          )}
        </div>
      </NavLink>

      <nav className="flex-1 m-3 space-y-4">
        {routes.map(({ to, icon: Icon, text }) => (
          <NavItem
            key={to}
            to={to}
            icon={Icon}
            label={text}
            isHovered={isHovered}
          />
        ))}
      </nav>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, isHovered }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 rounded-xl ${
          isActive ? "bg-blue-600 text-white" : ""
        }`
      }
    >
      <Icon className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
      {isHovered && <span>{label}</span>}
    </NavLink>
  );
}