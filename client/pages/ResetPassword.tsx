import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  Play,
  Brain,
  TrendingUp,
  Megaphone,
  Activity,
  Sparkles,
  Globe,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AssociationPartners from "@/components/auth/AssociationPartners";
import IntegrationsFooter from "@/components/auth/IntegrationsFooter";
import {
  resetPassword,
  selectAuth,
  selectIsLoading,
  selectUidAndToken,
  clearError,
} from "@/store/reducers/authSlice";
import { resetPasswordSchema } from "@/api/services/authService";
import { AppDispatch } from "@/store";

interface ResetPasswordForm {
  password: string;
  re_password: string;
}

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectAuth);
  const uidAndToken = useSelector(selectUidAndToken);
  
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      re_password: "",
    },
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if no token/uid
  useEffect(() => {
    if (!uidAndToken?.token || !uidAndToken?.uid) {
      navigate("/forgot-password");
    }
  }, [uidAndToken, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!uidAndToken?.token || !uidAndToken?.uid) {
      toast.error("Invalid reset session. Please start over.");
      navigate("/forgot-password");
      return;
    }

    try {
      const payload = {
        password: data.password,
        token: uidAndToken.token,
        uid: uidAndToken.uid,
      };

      const result = await dispatch(resetPassword(payload));
      
      if (result.type === "auth/resetPassword/fulfilled") {
        toast.success("Password reset successfully! Please login with your new password.");
        navigate("/login");
      } else if (result.type === "auth/resetPassword/rejected") {
        toast.error(result.payload as string || "Password reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedPassword || "");
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const aiElements = [
    {
      top: "10%",
      left: "15%",
      delay: "0s",
      size: "w-3 h-3",
      color: "bg-valasys-orange/30",
    },
    {
      top: "25%",
      right: "20%",
      delay: "1s",
      size: "w-2 h-2",
      color: "bg-valasys-blue/40",
    },
    {
      top: "40%",
      left: "8%",
      delay: "2s",
      size: "w-4 h-4",
      color: "bg-valasys-green/25",
    },
    {
      top: "60%",
      right: "12%",
      delay: "3s",
      size: "w-2.5 h-2.5",
      color: "bg-valasys-orange/35",
    },
    {
      top: "75%",
      left: "25%",
      delay: "4s",
      size: "w-3.5 h-3.5",
      color: "bg-valasys-blue/30",
    },
    {
      top: "85%",
      right: "35%",
      delay: "0.5s",
      size: "w-2 h-2",
      color: "bg-valasys-green/40",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 lg:grid lg:grid-cols-2 relative overflow-hidden">
      {/* Background AI/Neural Network Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(255,106,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(26,115,232,0.12),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(0,196,140,0.12),transparent_40%)]"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-valasys-orange/25 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-valasys-blue/25 blur-3xl"></div>
        {aiElements.map((e, i) => (
          <div
            key={i}
            className={`absolute ${e.size} ${e.color} rounded-full animate-pulse`}
            style={{
              top: e.top,
              left: (e as any).left,
              right: (e as any).right,
              animationDelay: e.delay,
            }}
          />
        ))}
      </div>

      {/* Left Side - Reset Password Form */}
      <div className="flex items-center justify-center p-8 relative z-10">
        <div
          className={`w-full max-w-md space-y-6 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <Card className="border-valasys-gray-200 shadow-xl hover:shadow-2xl transition-all duration-400 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-4 text-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F76d83d63beb8455692b1855a78aa9524%2F5ee47be8ea214f9c9b220b553ddb9ad1?format=webp&width=800"
                alt="Valasys AI Score logo"
                className="mx-auto h-12 w-auto object-contain mb-4"
              />
              <CardTitle className="text-lg font-semibold text-valasys-gray-900">
                Set New Password
              </CardTitle>
              <p className="text-sm text-valasys-gray-600">
                Your new password must be different from previously used passwords.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-valasys-gray-700 flex items-center space-x-1"
                  >
                    <Lock className="h-3 w-3" />
                    <span>New Password</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "password" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      {...register("password")}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-valasys-gray-400 hover:text-valasys-orange transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {watchedPassword && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                              level <= passwordStrength
                                ? strengthColors[passwordStrength - 1] || "bg-gray-200"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-valasys-gray-600">
                        Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="re_password"
                    className="text-valasys-gray-700 flex items-center space-x-1"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Confirm Password</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "re_password" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                    />
                    <Input
                      id="re_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...register("re_password")}
                      onFocus={() => setFocusedField("re_password")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-valasys-gray-400 hover:text-valasys-orange transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.re_password && (
                    <p className="text-red-500 text-xs mt-1">{errors.re_password.message}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-valasys-gray-50 border border-valasys-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-valasys-gray-700 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-xs text-valasys-gray-600 space-y-1">
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${(watchedPassword?.length || 0) >= 8 ? "bg-green-500" : "bg-gray-300"}`} />
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(watchedPassword || "") ? "bg-green-500" : "bg-gray-300"}`} />
                      <span>One lowercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(watchedPassword || "") ? "bg-green-500" : "bg-gray-300"}`} />
                      <span>One uppercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/\d/.test(watchedPassword || "") ? "bg-green-500" : "bg-gray-300"}`} />
                      <span>One number</span>
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>

              {/* Help link */}
              <div className="text-center pt-4 border-t border-valasys-gray-200">
                <p className="text-sm text-valasys-gray-600">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-valasys-orange hover:text-valasys-orange-light font-medium transition-colors duration-200 hover:underline"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="pt-4">
            <IntegrationsFooter />
          </div>
        </div>
      </div>

      {/* Right Side - Keep same structure as other auth pages */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-valasys-orange/10 via-valasys-blue/10 to-valasys-green/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-valasys-orange/15 via-valasys-orange-light/10 to-valasys-blue/15"></div>
        <div className="relative z-10 flex flex-col justify-center space-y-8 p-8 w-full">
          <div
            className={`space-y-4 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl font-bold text-valasys-gray-900">
              Secure Your <span className="text-valasys-orange">VAIS</span> Account
            </h2>
            <p className="text-valasys-gray-600">
              Create a strong password to protect your AI-powered scoring platform 
              and keep your valuable insights secure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Strong Security
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Advanced encryption protects your password
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Password Requirements
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Enforced complexity for maximum security
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Data Protection
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Your AI insights remain completely secure
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Instant Access
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Immediate access to your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-valasys-gray-900 flex items-center justify-center space-x-2">
                  <Sparkles className="h-5 w-5 text-valasys-orange" />
                  <span>In Association With</span>
                </h3>
                <p className="text-valasys-gray-600 text-sm">
                  Trusted data and reviews partners
                </p>
              </div>
              <AssociationPartners />
            </div>
          </div>
          <div
            className={`flex items-center justify-center space-x-6 pt-6 border-t border-white/20 transform transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-valasys-green" />
              </div>
              <span className="text-sm font-medium text-valasys-gray-800">
                SOC 2 Compliant
              </span>
            </div>
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Shield className="h-4 w-4 text-valasys-blue" />
              </div>
              <span className="text-sm font-medium text-valasys-gray-800">
                GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
