"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Calendar as CalendarIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

export function SignupForm({
  open,
  onOpenChange,
  defaultTab = "login",
  redirectTo = "/dashboard",
}) {
  const router = useRouter();
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [dobPickerOpen, setDobPickerOpen] = useState(false);

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    watch: watchSignup,
    reset: resetSignup,
    setValue: setSignupValue,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
      dob: "1990-01-01",
    },
  });

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupPassword = watchSignup("password");
  const dobValue = watchSignup("dob");
  const dobDate = dobValue ? new Date(dobValue) : undefined;

  useEffect(() => {
    if (user) {
      onOpenChange?.(false);
    }
  }, [onOpenChange, user]);

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, open]);

  const handleAuthSuccess = () => {
    onOpenChange?.(false);
    resetLogin();
    resetSignup();
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  const onLoginSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      login(response.data.access_token);
      toast.success("Logged in successfully.");
      handleAuthSuccess();
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message[0] : message || "Login failed.",
      );
    }
  };

  const onSignupSubmit = async (data) => {
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        number: data.number,
        dob: data.dob,
      });

      const loginResponse = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      login(loginResponse.data.access_token);
      toast.success("Account created successfully.");
      handleAuthSuccess();
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message[0] : message || "Signup failed.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-xl font-semibold">Welcome</DialogTitle>
          <DialogDescription>Login or create your account</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Log in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form
              onSubmit={handleLoginSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <div className="space-y-3">
                <label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...registerLogin("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
                {loginErrors.email && (
                  <p className="text-sm text-destructive">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...registerLogin("password", {
                      required: "Password is required.",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-sm text-destructive">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoginSubmitting}
                className="w-full bg-linear-to-r from-purple-500 to-purple-600 text-white"
              >
                {isLoginSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <form
              onSubmit={handleSignupSubmit(onSignupSubmit)}
              className="space-y-4"
            >
              <div className="">
                <label htmlFor="signup-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="signup-name"
                  placeholder="Enter your name"
                  {...registerSignup("name", {
                    required: "Name is required.",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters.",
                    },
                  })}
                />
                {signupErrors.name && (
                  <p className="text-sm text-destructive">
                    {signupErrors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-sm font-medium">
                  Gender
                </label>
                <Select>
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...registerSignup("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
                {signupErrors.email && (
                  <p className="text-sm text-destructive">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-number" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="signup-number"
                  placeholder="Enter your phone number"
                  {...registerSignup("number", {
                    required: "Phone number is required.",
                  })}
                />
                {signupErrors.number && (
                  <p className="text-sm text-destructive">
                    {signupErrors.number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Popover open={dobPickerOpen} onOpenChange={setDobPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {dobDate ? format(dobDate, "yyyy-MM-dd") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dobDate}
                      onSelect={(date) => {
                        if (date) {
                          setSignupValue("dob", format(date, "yyyy-MM-dd"));
                          setDobPickerOpen(false);
                        }
                      }}
                      captionLayout="dropdown"
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                {signupErrors.dob && (
                  <p className="text-sm text-destructive">
                    {signupErrors.dob.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create password"
                    autoComplete="new-password"
                    {...registerSignup("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters.",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={
                      showSignupPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showSignupPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {signupErrors.password && (
                  <p className="text-sm text-destructive">
                    {signupErrors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={showSignupConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    {...registerSignup("confirmPassword", {
                      required: "Please confirm your password.",
                      validate: (value) =>
                        value === signupPassword || "Passwords do not match.",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowSignupConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={
                      showSignupConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {signupErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {signupErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSignupSubmitting}
                className="w-full"
              >
                {isSignupSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
