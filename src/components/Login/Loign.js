import React, { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { Label } from "@com/ui/label";
import Background from "@/components/image/background.jpg";
import Confirmagedialog from "./Confirmagedialog";

const phoneRegex = new RegExp(
  /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
);

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    mobileNumber: z
      .string()
      .min(10, "Invalid mobile number")
      .max(10, "Invalid mobile number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [alertDialog, setAlertDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setAlertDialog(false);
    // Call register API
    console.log("Registering user:", formData);
  };

  const getFieldError = (field) => errors?.[field]?._errors?.[0];

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {isLogin ? (
            <>
              <div className="grid gap-2 text-center">
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
                <h1 className="text-3xl font-bold">Register</h1>
                <p className="text-balance text-muted-foreground">
                  Fill in the details below to create a new account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="flex gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={
                        getFieldError("firstName") ? "border-red-500" : ""
                      }
                    />
                    {getFieldError("firstName") && (
                      <p className="text-red-500">
                        {getFieldError("firstName")}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      type="text"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={
                        getFieldError("lastName") ? "border-red-500" : ""
                      }
                    />
                    {getFieldError("lastName") && (
                      <p className="text-red-500">
                        {getFieldError("lastName")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={
                      getFieldError("mobileNumber") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("mobileNumber") && (
                    <p className="text-red-500">
                      {getFieldError("mobileNumber")}
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
                  <Label htmlFor="confirmPassword">Re-enter Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={
                      getFieldError("confirmPassword") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("confirmPassword") && (
                    <p className="text-red-500">
                      {getFieldError("confirmPassword")}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Register
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
      <div className="hidden bg-muted lg:block max-h-[930px]">
        <img
          src={Background}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Auth;
