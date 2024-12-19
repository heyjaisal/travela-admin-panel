import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaArrowRight,
  FaClipboardList,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Fetch token

  useEffect(() => {
    console.log("hello world");
    
    if (!token) {
      navigate('/'); // Redirect to login page if no token
    }
  }, [navigate, token]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Total Sales</h2>
              <p className="text-4xl font-semibold mt-2">$34,434</p>
            </div>
            <FaDollarSign className="text-4xl" />
          </div>
          <hr className="my-4 border-t-2 border-white" />
          <div className="flex justify-between items-center">
            <a href="/sales" className="font-medium hover:underline flex items-center space-x-1">
              <span>See all</span>
              <FaArrowRight />
            </a>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Total Bookings</h2>
              <p className="text-4xl font-semibold mt-2">34,434</p>
            </div>
            <FaClipboardList className="text-4xl" />
          </div>
          <hr className="my-4 border-t-2 border-white" />
          <div className="flex justify-between items-center">
            <a href="/bookings" className="font-medium hover:underline flex items-center space-x-1">
              <span>See all</span>
              <FaArrowRight />
            </a>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Total Revenue</h2>
              <p className="text-4xl font-semibold mt-2">$12,567</p>
            </div>
            <FaChartBar className="text-4xl" />
          </div>
          <hr className="my-4 border-t-2 border-white" />
          <div className="flex justify-between items-center">
            <a href="/revenue" className="font-medium hover:underline flex items-center space-x-1">
              <span>See all</span>
              <FaArrowRight />
            </a>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">New Customers</h2>
              <p className="text-4xl font-semibold mt-2">1,234</p>
            </div>
            <FaUsers className="text-4xl" />
          </div>
          <hr className="my-4 border-t-2 border-white" />
          <div className="flex justify-between items-center">
            <a href="/customers" className="font-medium hover:underline flex items-center space-x-1">
              <span>See all</span>
              <FaArrowRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
