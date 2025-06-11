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
import { apiClient } from "@/lib/api-client.js";
import { useStore } from "@/store/index.js";
import { SIGNUP_ROUTE } from "@/utils/constants.js";
import { MessageCircle, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const { setUserInfo } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateSignup = () => {
    if (!email.length || !password.length || !fullName.length) {
      toast.error("All fields are required...", {
        position: "top-center",
        duration: 2000,
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Confirm password must be same as password", {
        position: "top-center",
        duration: 2000,
      });
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateSignup()) {
      setIsLoading(true);
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password, fullName },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }

        toast.success("Account created successfully!", {
          position: "top-center",
          duration: 2000,
        });
      } catch (error) {
        console.error("Signup error:", error.response || error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        {/* Logo Section - Reduced size */}
        <div className="text-center mb-3">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 p-2 shadow-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-lg font-bold text-white">
            Join <span className="text-purple-500">QuickTalk</span>
          </h1>
        </div>

        {/* Signup Card - More compact */}
        <Card className="bg-slate-800/50 border-slate-700/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-lg text-white text-center">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 py-2">
            <form onSubmit={handleSignup}>
              <div className="grid gap-4">
                {/* Full Name Field */}
                <div className="grid gap-1">
                  <Label
                    htmlFor="name"
                    className="text-white text-xs font-medium"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`pl-8 py-1 h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="grid gap-1">
                  <Label
                    htmlFor="email"
                    className="text-white text-xs font-medium"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-8 py-1 h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-1">
                  <Label
                    htmlFor="password"
                    className="text-white text-xs font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-8 pr-8 py-1 h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="grid gap-1">
                  <Label
                    htmlFor="confirm-password"
                    className="text-white text-xs font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-8 pr-8 py-1 h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms Agreement - More compact */}
                <div className="flex items-start space-x-2 pt-1">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={setAgreeTerms}
                    className={`mt-0.5 h-3 w-3 border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs text-slate-300 cursor-pointer leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      privacy policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button - Smaller */}
              <Button
                className="w-full mt-5 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium py-1 h-8 transition-all duration-200 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center py-2 px-5">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors ml-1"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
