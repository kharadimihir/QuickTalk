/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { useStore } from "@/store/index.js";
import { LOGIN_ROUTE } from "@/utils/constants";
import { MessageCircle, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const { setUserInfo } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required", {
        duration: 2000,
        position: "top-center",
      });
      return false;
    }

    if (!password.length) {
      toast.error("Password is required", {
        duration: 2000,
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password });

        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
        toast.success("Login successfully!", {
          position: "top-center",
          duration: 2000,
        });
      } catch (error) {
        console.error("Login error:", error.response || error.message);
        toast.error(
          `Something went wrong: ${error.response?.data || error.message}`,
          {
            position: "top-center",
            duration: 2000,
          }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 p-2.5 shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-white">
            Welcome to <span className="text-purple-500">QuickTalk</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Sign in to continue your conversations
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/50 border-slate-700/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="py-1 px-5">
            <CardTitle className="text-xl text-white text-center">
              Sign In
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-3">
            <form onSubmit={handleLogin}>
              <div className="grid gap-3">
                {/* Email Field */}
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="email"
                    className="text-white text-sm font-medium"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 py-2 h-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-white text-sm font-medium"
                    >
                      Password
                    </Label>
                    <Link
                      to="#"
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 py-2 h-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    className="h-4 w-4 border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-slate-300 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full mt-4 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 h-10 transition-all duration-200 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center py-2 px-5">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors ml-1"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
