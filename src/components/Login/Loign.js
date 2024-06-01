import React, { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { Label } from "@com/ui/label";
import Background from "@/components/image/background.jpg";
import Confirmagedialog from "./Confirmagedialog";
import Logo from "@/components/image/Logo.png";
import axios from "axios";
const phoneRegex = new RegExp(
  /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
);

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    full_name: z.string().min(1, "First name is required"),
    mobile_number: z
      .string()
      .min(10, "Invalid mobile number")
      .max(10, "Invalid mobile number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [alertDialog, setAlertDialog] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateLogin = () => {
    const result = loginSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateRegister = () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (validateLogin()) {
        // Call login API
        axios
          .post("http://127.0.0.1:8000/api/login", { ...formData })
          .then((res) => {
            console.log(res);
          });

        console.log("Login data:", {
          email: formData.email,
          password: formData.password,
        });
      }
    } else {
      if (validateRegister()) {
        setAlertDialog(true);
      }
    }
  };

  const handleRegisterConfirm = () => {
    if (!validateRegister()) return;
    axios
      .post("http://127.0.0.1:8000/api/register", { ...formData })
      .then((res) => {
        console.log(res);
      });

    setAlertDialog(false);
    // Call register API

    console.log("Registering user:", formData);
  };

  const getFieldError = (field) => errors?.[field]?._errors?.[0];

  return (
    <div className="w-full lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-[720px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {isLogin ? (
            <>
              <div className="relative grid gap-2 text-center">
                <div>
                  <img
                    className="relative bottom-2  mx-auto w-[200px]"
                    src={Logo}
                    alt=""
                  />
                </div>
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={getFieldError("email") ? "border-red-500" : ""}
                  />
                  {getFieldError("email") && (
                    <p className="text-red-500">{getFieldError("email")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={
                      getFieldError("password") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("password") && (
                    <p className="text-red-500">{getFieldError("password")}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <button onClick={toggleAuthMode} className="underline">
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              {alertDialog && (
                <Confirmagedialog
                  alertDialog={alertDialog}
                  setAlertDialog={setAlertDialog}
                  onConfirm={handleRegisterConfirm}
                  onCancel={() => setAlertDialog(false)}
                />
              )}
              <div className="grid gap-2 text-center">
                <div>
                  <img
                    className="relative bottom-2  mx-auto w-[200px]"
                    src={Logo}
                    alt=""
                  />
                </div>
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-balance text-muted-foreground">
                  Fill in the details below to create a new account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={
                      getFieldError("full_name") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("full_name") && (
                    <p className="text-red-500">{getFieldError("full_name")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mobile_number">Mobile Number</Label>
                  <Input
                    id="mobile_number"
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className={
                      getFieldError("mobile_number") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("mobile_number") && (
                    <p className="text-red-500">
                      {getFieldError("mobile_number")}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={getFieldError("email") ? "border-red-500" : ""}
                  />
                  {getFieldError("email") && (
                    <p className="text-red-500">{getFieldError("email")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={
                      getFieldError("password") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("password") && (
                    <p className="text-red-500">{getFieldError("password")}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    Re-enter Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className={
                      getFieldError("password_confirmation")
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {getFieldError("password_confirmation") && (
                    <p className="text-red-500">
                      {getFieldError("password_confirmation")}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button onClick={toggleAuthMode} className="underline">
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="hidden bg-muted lg:block  max-h-[750px]">
        <img
          src={Background}
          alt="Image"
          className="h-[800px] w-[1920px] object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Auth;