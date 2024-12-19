// import { Outlet, Navigate } from "react-router-dom";
// import AdminNavbar from "./Admin-navbar";
// import { useState, useEffect, useMemo } from "react";
// import axios from "axios";

// const AdminDashboardLayout = () => {
//   const test = 0
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); 

//   const token = localStorage.getItem("token");
  

//   useEffect(() => {
//    if (token && !userRole) {
//     fetchUserRole();
//    }
   
// }, [token]); 


//   if (!token) {
//     return <Navigate to="/login" />;
//   }


//   const fetchUserRole =  async () => { 
//     try {
//       console.log("wsdefrtg65tryg76rtg768tguyi");
      
//       const response = await axios.get("http://localhost:5000/api/verify-token", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//      console.log(response)
     
//       if (response?.data?.role) {
//         setUserRole(response.data.role);
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (error) {
//       console.error("Error fetching user role", error);
//       setError("Error fetching user role. Please log in again.");
//       localStorage.removeItem("token"); 
//       setUserRole(null); 
//     } finally {
//       setLoading(false);
//     }
//   };


  
//   if (loading) {
//     return <div>Loading...</div>;
//   }

  
//   if (error) {
//     return <div>{error}</div>;
//   }


//   if (userRole !== "admin" && userRole !== "super-admin") {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="flex h-screen">
//       <AdminNavbar role={userRole} />
//       <div className="flex-1 p-1 overflow-auto bg-lightBg">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardLayout;

import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "./Admin-navbar";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const AdminDashboardLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUserRole = useCallback(async () => {
    try {
      console.log("wsdefrtg65tryg76rtg768tguyi");
      const response = await axios.get("/api/user/role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.role);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && !userRole) {
      fetchUserRole();
    }
  }, [token, fetchUserRole]);

  const memoizedFetchUserRole = useMemo(() => fetchUserRole, [fetchUserRole]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
        <div className="flex h-screen">
          <AdminNavbar role={userRole} />
          <div className="flex-1 p-1 overflow-auto bg-lightBg">
            <Outlet />
          </div>
        </div>
  );
};

export default AdminDashboardLayout;


