import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios-instance";
import BlogCard from "../Components/cards/blog-card";
import InfiniteScroll from "react-infinite-scroll-component";
import { ScaleLoader } from "react-spinners";
import { User } from "lucide-react";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("post");
  const isLoading = useRef(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/admin/profile/${id}`, { 
          params: { type: 'user' },
          withCredentials: true 
        });        
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [id]);

  const fetchUserBlogs = async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    
    try {
      const { data } = await axiosInstance.get(`/admin/profile/${id}/blogs`, {
        withCredentials: true,
        params: { page, limit: 2 },
      });
      
      setBlogs((prev) => [
        ...prev,
        ...data.blogs.filter((newItem) => !prev.some((item) => item._id === newItem._id))
      ]);
      setHasMore(data.blogs.length > 0);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, [id]);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  const UserInfo = () => (
    <div className="text-center">
      <Avatar className="w-12 h-12 rounded-full overflow-hidden mx-auto">
        {user.image ? (
          <AvatarImage
            src={user.image}
            alt="profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-white text-lg font-bold rounded-full">
            {user.firstName?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase()}
          </div>
        )}
      </Avatar>
      <h3 className="text-lg font-semibold mt-2">
        {user.firstName} {user.lastName}
      </h3>
      <p className="text-gray-500 text-sm">{user.country}</p>
      <p className="text-gray-500 text-sm">{user.email}</p>
      <p className="text-gray-500 text-sm">{user.gender}</p>
      <p className="text-black text-lg">{user.followerCount} followers</p>
      <div className="flex justify-center gap-2 mt-4">
        <button
          
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Edit
        </button>
        <button className="border py-2 px-4 rounded-lg">Message</button>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col md:flex-row p-4 max-w-6xl mx-auto">
      <div className="w-full md:w-2/3 p-4 h-screen overflow-y-scroll scrollbar-hide">
        <h2 className="text-2xl font-bold mb-5">{user.firstName} {user.lastName}</h2>
        
        <div className="flex gap-4 border-b mt-2 md:hidden mb-5">
          <button className={`py-2 px-4 ${activeTab === "post" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("post")}>
            Posts
          </button>
          <button className={`py-2 px-4 ${activeTab === "about" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("about")}>
            About
          </button>
        </div>

        {activeTab === "post" ? (
          <InfiniteScroll
            dataLength={blogs.length}
            next={fetchUserBlogs}
            hasMore={hasMore}
            loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
            endMessage={<div className="text-center text-gray-500 py-4">No more posts</div>}
          >
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))
            ) : (
              <p className="text-gray-500 mt-4">No posts available.</p>
            )}
          </InfiniteScroll>
        ) : (
          <div className="text-center p-4 border rounded-lg mt-4 md:hidden">
              <UserInfo />
            </div>
        )}
      </div>

      <div className="hidden md:block w-1/3 p-4 border-l sticky top-0 h-screen">
          <UserInfo />
        </div>
    </div>
  );
};

export default ProfilePage;
