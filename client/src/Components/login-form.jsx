import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserInfo, setAllowedPages } from "../redux/slice/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import logo from "../assets/logo.png";
import { addToast } from "@heroui/react"; // Import addToast

const LoginForm = ({ className, ...props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Enter a valid email";

    if (!password) errors.password = "Password is required";

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/admin/auth/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          const userData = response.data.user;

          dispatch(setUserInfo(userData));
          dispatch(setAllowedPages(userData.allowedPages));

          navigate("/home");
        }
      } catch (err) {
  
        const errorMessage = err?.response?.data?.message || "Login failed. Please try again.";

        addToast({
          title: errorMessage,
          color: "red",
        });
      }
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleLogin} {...props}>
      <div className="flex justify-center w-full top-4">
        <img src={logo} alt="logo" className="w-5" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-title mb-5">Login to your account</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </div>
    </form>
  );
};

export default LoginForm;