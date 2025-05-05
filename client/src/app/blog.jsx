import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios-instance";
import { ScaleLoader } from "react-spinners";
import RenderContent from "./renderContent";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/blog/${id}`, { withCredentials: true });
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" />
      </div>
    );

  if (!blog) return <p className="text-center">Blog not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-xl font-semibold">{blog.title}</h1>
      </div>
      <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />

      <div className="flex items-center gap-3 mb-4">
      <Link to={`/user/${blog.author?._id}`} className="flex items-center gap-3 mb-4 cursor-pointer">
  <Avatar>
    <AvatarImage src={blog.author?.image} alt={blog.author?.username} />
    <AvatarFallback>{blog.author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
  </Avatar>
  <div>
    <p className="text-lg font-semibold">{blog.author?.username}</p>
    <p className="text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
  </div>
</Link>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      {blog.location && <p className="text-gray-500 mb-2">📍 {blog.location}</p>}

      <RenderContent content={blog.content} />
      
    </div>
  );
};

export default BlogDetail;
