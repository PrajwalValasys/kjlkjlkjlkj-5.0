import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Mail,
  Shield,
  Play,
  Brain,
  TrendingUp,
  Megaphone,
  Activity,
  Sparkles,
  Globe,
  CheckCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AssociationPartners from "@/components/auth/AssociationPartners";
import IntegrationsFooter from "@/components/auth/IntegrationsFooter";
import {
  verifyPasswordResetOTP,
  sendPasswordResetOTP,
  setTokenAndUid,
  selectAuth,
  selectIsLoading,
  selectVerifyEmailOtp,
  clearError,
} from "@/store/reducers/authSlice";
import { AppDispatch } from "@/store";

export default function ForgotPasswordEmailVerification() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectAuth);
  const verifyEmailOtp = useSelector(selectVerifyEmailOtp);
  
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [validationError, setValidationError] = useState("");
  
  // Timer management
  const time = 180; // 3 minutes
  const initialTimerValue = localStorage.getItem("otpTimerEndTime")
    ? Math.ceil(
        (parseInt(localStorage.getItem("otpTimerEndTime")!) - new Date().getTime()) / 1000
      )
    : 0;
  
  const [timer, setTimer] = useState(initialTimerValue);
  const [isTimerRunning, setIsTimerRunning] = useState(initialTimerValue > 0);

  const getEmail = verifyEmailOtp.emailOtp?.email || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if no email in state
  useEffect(() => {
    if (!getEmail) {
      navigate("/forgot-password");
    }
  }, [getEmail, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Robust timer using recursive setTimeout to handle browser throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let startTime = Date.now();
    let lastExecutionTime = Date.now();
    let initialTimer = timer;

    function updateTimer() {
      const now = Date.now();
      const elapsed = now - lastExecutionTime;

      if (!document.hidden && isTimerRunning) {
        // Calculate actual time passed since start
        const totalElapsed = Math.floor((now - startTime) / 1000);
        const newTimer = Math.max(0, initialTimer - totalElapsed);
        setTimer(newTimer);
        lastExecutionTime = now;

        if (newTimer <= 0) {
          setIsTimerRunning(false);
          localStorage.removeItem("otpTimerEndTime");
          localStorage.removeItem("otp");
          return; // Stop the timer
        }
      }

      // Dynamic delay: shorter when tab is visible, longer when hidden
      const delay = document.hidden ? 5000 : Math.max(1000 - (elapsed % 1000), 0);

      if (isTimerRunning) {
        timeoutId = setTimeout(updateTimer, delay);
      }
    }

    if (isTimerRunning && timer > 0) {
      updateTimer();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isTimerRunning]); // Only depend on isTimerRunning

  useEffect(() => {
    if (isTimerRunning) {
      const timerEndTime = new Date().getTime() + timer * 1000;
      localStorage.setItem("otpTimerEndTime", timerEndTime.toString());
      localStorage.setItem("otp", otp);
    }
  }, [timer, otp, isTimerRunning]);

  const handleOtpChange = (value: string) => {
    // Check for non-numeric characters
    if (value && !/^\d+$/.test(value)) {
      setValidationError("Please enter only numbers");
    } else {
      setValidationError("");
    }
    // Filter out non-numeric characters
    const filteredOtp = value.replace(/\D/g, "");
    setOtp(filteredOtp);
    setOtpError(""); // Clear error when user types
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length < 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    if (!isTimerRunning) {
      setOtpError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      const payload = { email: getEmail, otp };
      const result = await dispatch(verifyPasswordResetOTP(payload));
      
      if (result.type === "auth/verifyPasswordResetOTP/fulfilled") {
        // Store token and uid for password reset
        dispatch(setTokenAndUid(result.payload as { token: string; uid: string }));
        clearOtpExpiry();
        toast.success("OTP verified successfully!");
        navigate("/reset-password");
      } else if (result.type === "auth/verifyPasswordResetOTP/rejected") {
        setOtpError(result.payload as string || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("Something went wrong. Please try again.");
    }
  };

  const onResendOtp = async () => {
    try {
      const result = await dispatch(sendPasswordResetOTP(getEmail));
      
      if (result.type === "auth/sendPasswordResetOTP/fulfilled") {
        setOtp("");
        setTimer(time);
        setIsTimerRunning(true);
        setOtpError("");
        localStorage.removeItem("otpTimerEndTime");
        localStorage.removeItem("otp");
        toast.success("New OTP sent to your email!");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  const clearOtpExpiry = () => {
    setTimer(time);
    setIsTimerRunning(false);
    localStorage.removeItem("otpTimerEndTime");
    localStorage.removeItem("otp");
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

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

      {/* Left Side - OTP Verification Form */}
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
              
              {/* Timer Status */}
              <div className="mb-4">
                {isTimerRunning ? (
                  <div className="flex items-center justify-center space-x-2 text-valasys-green">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      OTP expires in: {formatTime(timer)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-red-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">OTP Expired</span>
                  </div>
                )}
              </div>

              <CardTitle className="text-lg font-semibold text-valasys-gray-900">
                Enter Email Verification Code
              </CardTitle>
              <p className="text-sm text-valasys-gray-600">
                We've sent a code to{" "}
                <span className="font-medium">
                  {getEmail.replace(/(?<=.{3}).(?=.*@)/g, '*')}
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-valasys-gray-700">
                    Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={4}
                      value={otp}
                      onChange={handleOtpChange}
                      className="gap-2"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 w-14 h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 w-14 h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={2}
                          className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 w-14 h-14 text-lg"
                        />
                        <InputOTPSlot
                          index={3}
                          className="border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 w-14 h-14 text-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  {/* Error Messages */}
                  {validationError && (
                    <p className="text-red-500 text-xs text-center mt-2">{validationError}</p>
                  )}
                  {otpError && (
                    <p className="text-red-500 text-xs text-center mt-2">{otpError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Link to="/forgot-password" className="inline-flex">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-valasys-gray-300 text-valasys-gray-700 hover:bg-valasys-gray-50"
                      onClick={clearOtpExpiry}
                    >
                      ← Back
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length < 4 || !!validationError || !isTimerRunning}
                    className="bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Resend OTP */}
              <div className="text-center pt-4 border-t border-valasys-gray-200">
                <p className="text-sm text-valasys-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={onResendOtp}
                  disabled={isTimerRunning || isLoading}
                  className={`text-sm font-medium transition-colors ${
                    !isTimerRunning && !isLoading
                      ? "text-valasys-orange hover:text-valasys-orange-light cursor-pointer"
                      : "text-valasys-gray-400 cursor-not-allowed"
                  }`}
                >
                  {!isTimerRunning && !isLoading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <RefreshCw className="h-3 w-3" />
                      <span>Resend Code</span>
                    </div>
                  ) : (
                    `Resend available in ${formatTime(timer)}`
                  )}
                </button>
              </div>

              {/* Help link */}
              <div className="text-center">
                <p className="text-sm text-valasys-gray-600">
                  Back to{" "}
                  <Link 
                    to="/login" 
                    onClick={clearOtpExpiry}
                    className="text-valasys-orange hover:text-valasys-orange-light font-medium transition-colors duration-200 hover:underline"
                  >
                    Login
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
              Verify Your <span className="text-valasys-orange">Identity</span>
            </h2>
            <p className="text-valasys-gray-600">
              We've sent a secure verification code to your email address. 
              Enter it below to proceed with password reset.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Secure Verification
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    One-time code expires in 3 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Email Protected
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Code sent to your registered email only
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Time Limited
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Enhanced security with expiring codes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Quick Process
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Get back to your insights quickly
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
