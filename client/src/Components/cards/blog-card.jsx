import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)} 
      className="relative p-4 border rounded-lg flex flex-col md:flex-row gap-4 bg-white shadow-sm hover:shadow-md transition-all mb-4 cursor-pointer"
    >
      <img
        src={blog.thumbnail || "https://source.unsplash.com/random/400x250"}
        alt="Post Thumbnail"
        className="w-full md:w-60 h-40 md:h-40 rounded-lg object-cover"
      />
      <div className="flex flex-col justify-between w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Avatar className="w-10 h-10">
              <AvatarImage src={blog.author?.image || "https://source.unsplash.com/random/40x40"} alt="Author" />
              <AvatarFallback>{blog.author?.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-gray-700">{blog.author?.username}</h1>
          </div>

          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-50">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(blog._id); }}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-lg md:text-xl mt-1 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-500 text-xs md:text-sm">{new Date(blog.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default BlogCard;
