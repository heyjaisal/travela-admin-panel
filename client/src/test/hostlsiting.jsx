// import React, { useState, useEffect, useRef } from "react";
// import axiosInstance from "axiosInstance";
// import { ToastContainer, toast } from "react-toastify";
// import { useSelector, useDispatch } from "react-redux";
// import { setUserInfo } from "@/redux/slice/auth";
// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { API_BASE_URL } from "@/utils/constants";
// import { ScaleLoader } from "react-spinners";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// const Profile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const userinfo = useSelector((state) => state.auth.userInfo);
//   const [image, setImage] = useState(userinfo?.image || null);
//   const fileInputRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [profileData, setProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     username: "",
//     country: "",
//     email: "",
//     phone: "",
//     street: "",
//     city: "",
//     gender: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get(`${API_BASE_URL}/api/auth/profile`, {
//           withCredentials: true,
//         });
//         setProfileData(response.data);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         toast.error("Failed to fetch user data");
//       }
//     };

//     fetchData();
//   }, []);

//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateFields = () => {
//     let tempErrors = {};

//     if (!profileData.firstName) tempErrors.firstName = "First name is required";
//     if (!profileData.lastName) tempErrors.lastName = "Last name is required";
//     if (!profileData.username) tempErrors.username = "Username is required";
//     if (!profileData.street) tempErrors.street = "Street is required";
//     if (!profileData.country) tempErrors.country = "Country is required";
//     if (!profileData.city) tempErrors.city = "City is required";
//     if (!profileData.gender) tempErrors.gender = "Gender is required";

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSave = async () => {
//     if (validateFields()) {
//       try {
//         const { data } = await axiosInstance.put(
//           `${API_BASE_URL}/api/auth/profile`,
//           profileData,
//           { withCredentials: true }
//         );
//         dispatch(setUserInfo(data.user));
//         toast.success("Profile details submitted successfully!");
//       } catch (error) {
//         if (error.response?.data?.message === "Phone number already exists") {
//           setErrors((prev) => ({
//             ...prev,
//             phone: error.response.data.message,
//           }));
//         } else {
//           toast.error("Failed to update profile");
//         }
//       }
//     }
//   };

//   const logOut = async () => {
//     const response = await axiosInstance.get(`${API_BASE_URL}/api/auth/logout`, {
//       withCredentials: true,
//     });
//     if (response.status === 200) {
//       dispatch(setUserInfo(undefined));
//       navigate("/login");
//     }
//   };

//   const handleImage = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("type", "profile");

//     setLoading(true);
//     try {
//       const response = await axiosInstance.post(`${API_BASE_URL}/api/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         const imageUrl = response.data.imageUrl;
//         dispatch(setUserInfo({ ...userinfo, image: imageUrl }));
//         setImage(imageUrl);
//         toast.success("Image uploaded successfully!");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast.error("Failed to upload image");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteImage = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.delete(`${API_BASE_URL}/api/delete`, {
//         withCredentials: true,
//         data: {
//           image: image,
//           type: "profile",
//         },
//       });

//       if (response.status === 200) {
//         dispatch(setUserInfo({ ...userinfo, image: null }));
//         setImage(null);
//         toast.success("Image deleted successfully!");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       toast.error("Failed to delete image");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ScaleLoader color="#4fa94d" aria-label="loading" style={{ display: "block" }} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl font-bold text-gray-700">
//             Welcome, {profileData.firstName} {profileData.lastName}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Avatar Section */}
//             <div className="flex flex-col items-center md:w-1/3">
//               <div
//                 className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
//                 onMouseEnter={() => setHovered(true)}
//                 onMouseLeave={() => setHovered(false)}
//               >
//                 <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
//                   {image ? (
//                     <AvatarImage src={image} alt="profile" className="object-cover w-full h-full" />
//                   ) : (
//                     <div className="flex items-center justify-center w-full h-full text-5xl border rounded-full">
//                       {profileData.firstName
//                         ? profileData.firstName.charAt(0)
//                         : profileData.email.charAt(0)}
//                     </div>
//                   )}
//                 </Avatar>
//                 {hovered && (
//                   <div
//                     className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
//                     onClick={image ? deleteImage : () => fileInputRef.current.click()}
//                   >
//                     {image ? (
//                       <FaTrash className="text-white text-3xl" />
//                     ) : (
//                       <FaPlus className="text-white text-3xl" />
//                     )}
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="hidden"
//                   onChange={handleImage}
//                   name="profile-image"
//                   accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
//                 />
//               </div>
//               <h3 className="mt-4 text-lg font-semibold">
//                 {profileData.firstName} {profileData.lastName}
//               </h3>
//               <div className="mt-2 w-full">
//                 <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
//                   Email:
//                 </Label>
//                 <Input id="email" name="email" value={profileData.email} disabled className="mt-1" />
//               </div>
//             </div>

//             {/* Profile Details Section */}
//             <div className="flex-1 space-y-4">
//               <div>
//                 <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
//                   First Name:
//                 </Label>
//                 <Input
//                   id="firstName"
//                   name="firstName"
//                   value={profileData.firstName}
//                   onChange={handleFieldChange}
//                   className="mt-1"
//                 />
//                 {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
//                   Last Name:
//                 </Label>
//                 <Input
//                   id="lastName"
//                   name="lastName"
//                   value={profileData.lastName}
//                   onChange={handleFieldChange}
//                   className="mt-1"
//                 />
//                 {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
//                   Country:
//                 </Label>
//                 <Input
//                   id="country"
//                   name="country"
//                   value={profileData.country}
//                   onChange={handleFieldChange}
//                   className="mt-1"
//                 />
//                 {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
//                   City:
//                 </Label>
//                 <Input
//                   id="city"
//                   name="city"
//                   value={profileData.city}
//                   onChange={handleFieldChange}
//                   className="mt-1"
//                 />
//                 {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//               </div>
//             </div>

//             {/* Account Details Section */}
//             <div className="flex-1 space-y-4">
//               <div>
//                 <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
//                   Username:
//                 </Label>
//                 <Input
//                   id="username"
//                   name="username"
//                   value={profileData.username}
//                   onChange={handleFieldChange}
//                   className="mt-1"
//                 />
//                 {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="street" className="text-sm font-semibold text-gray-700">
//                   Street:
//                 </Label>
//                 <Input
//                   id="street"
//                   name="street"
//                   value={profileData.street}
//                   onChange={handleFieldChange}
//                   className="mt-1"
//                 />
//                 {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
//               </div>
//               <div>
//                 <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
//                   Gender:
//                 </Label>
//                 <select
//                   id="gender"
//                   name="gender"
//                   value={profileData.gender}
//                   onChange={handleFieldChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//                 {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-end space-x-4">
//           <Button onClick={handleSave} className="bg-blue-500 text-white">
//             Save
//           </Button>
//           <Button onClick={logOut} variant="destructive">
//             Logout
//           </Button>
//         </CardFooter>
//       </Card>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Profile;
