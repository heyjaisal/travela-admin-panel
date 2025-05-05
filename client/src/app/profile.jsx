
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axios-instance";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/slice/auth";
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/utils/constants";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useOnceEffect } from "@/utils/onceuseEffect";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.auth.userInfo);
  const [image, setImage] = useState(userinfo?.image || null);
  const fileInputRef = useRef(null);
  const [loadings, setLoadings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [errors, setErrors] = useState({});

  const [Profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    name: "",
    country: "",
    email: "",
    mobile: "",
    street: "",
    city: "",
  });

 
  useOnceEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile', {
          withCredentials: true,
        });
        setProfile(response.data.user);
 
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchData();
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };


  const validateFields = () => {
    let tempErrors = {};

    if (!Profile.firstName) tempErrors.firstName = "First name is required";
    if (!Profile.lastName) tempErrors.lastName = "Last name is required";
    if (!Profile.username) tempErrors.username = "Username is required";
    if (!Profile.street) tempErrors.street = "Street is required";
    if (!Profile.country) tempErrors.country = "Country is required";
    if (!Profile.city) tempErrors.city = "City is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
   
    
    if (validateFields()) {
  
      try {
        const { data } = await axiosInstance.put(
          '/auth/profile',
          Profile,
          { withCredentials: true }
        );

        dispatch(setUserInfo(data.user));
        toast.success("Profile details submitted successfully!");
      } catch (error) {
        if (error.response?.data?.message === "mobile number already exists") {
          setErrors((prev) => ({
            ...prev,
            mobile: error.response.data.message,
          }));
        } else {
          toast.error("Failed to update profile");
        }
      }
    }
  };

  const logOut = async () => {
    const response = await axiosInstance.get('/auth/logout', {
      withCredentials: true,
    });
  
  
    if (response.status === 200) {
      window.location.reload();
      dispatch(setUserInfo(undefined));
      window.location.reload();
    }
  };
  
  const handleImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "profile");

    setLoading(true);
    try {
      const response = await axiosInstance.post(
       '/user/upload',
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const imageUrl = response.data.imageUrl;
        dispatch(setUserInfo({ ...userinfo, image: imageUrl }));
        setImage(imageUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        '/user/delete',
        {
          withCredentials: true,
          data: {
            image: image, 
            type: "profile", 
          },
        }
      );

      if (response.status === 200) {
        dispatch(setUserInfo({ ...userinfo, image: null }));
        setImage(null);
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Circles
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-700">
            Welcome, {Profile.firstName} {Profile.lastName}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg mt-6 p-6 flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex flex-col items-center md:w-1/3">
          <div
            className="h-full w-24 md:w-32 md:h-32 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-24 w-24 md:w-32 md:h-32 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-24 w-24 md:w-32 md:h-32 text-5xl border-[1px] flex items-center justify-center">
                  {Profile.username
                    ? Profile.username.split("").shift()
                    : Profile.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={
                  image ? deleteImage : () => fileInputRef.current.click()
                }
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImage}
              name="profile-image"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
            />
          </div>
          <h3 className="text-lg font-semibold mt-4">
            {Profile.firstName} <span>{Profile.lastName}</span>
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email:
            </label>
            <input
              type="text"
              name="email"
              value={Profile.email}
              disabled
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              value={Profile.firstName}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              value={Profile.lastName}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Country:
            </label>
            <input
              type="text"
              name="country"
              value={Profile.country}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              City:
            </label>
            <input
              type="text"
              name="city"
              value={Profile.city}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={Profile.username}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              mobile:
            </label>
            <input
              type="tel"
              name="mobile"
              disabled
              value={Profile.mobile}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Street:
            </label>
            <input
              type="text"
              name="street"
              value={Profile.street}
              onChange={handleFieldChange}
              className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>
       

          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 m-2"
          >
            Save
          </button>
          <button
            onClick={logOut}
            className="bg-red-600 text-white px-4 py-2 rounded mt-4 m-2"
          >
            Logout
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
