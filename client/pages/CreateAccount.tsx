import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Globe,
  Sparkles,
  CheckCircle,
  Shield,
  Play,
  Activity,
  TrendingUp,
  Megaphone,
  User,
  Building2,
  Briefcase,
  Phone as PhoneIcon,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import IntegrationsFooter from "@/components/auth/IntegrationsFooter";
import AssociationPartners from "@/components/auth/AssociationPartners";
import {
  registerUser,
  selectAuth,
  selectIsLoading,
  selectVerifyEmail,
  clearError,
} from "@/store/reducers/authSlice";
import { registerSchema, type RegisterData } from "@/api/services/authService";
import { AppDispatch } from "@/store";

export default function CreateAccount() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectAuth);
  const verifyEmail = useSelector(selectVerifyEmail);
  
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  // Get business email from Redux state
  const getBusinessEmail = verifyEmail.regEmailInfo?.email || "";

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: getBusinessEmail,
      phone_number: "",
      company: "",
      password: "",
      re_password: "",
      designation: "",
      workAddress: "",
      country: "",
      linkedIn: "",
      latitude: "",
      longitude: "",
    },
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if no email in state
  useEffect(() => {
    if (!getBusinessEmail) {
      navigate("/free-trial");
    }
  }, [getBusinessEmail, navigate]);

  // Set email from Redux state
  useEffect(() => {
    if (getBusinessEmail) {
      setValue("username", getBusinessEmail);
    }
  }, [getBusinessEmail, setValue]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterData) => {
    if (!isCheckboxChecked) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    try {
      const result = await dispatch(registerUser(data));
      
      if (result.type === "auth/register/fulfilled") {
        // Set OTP timer for 3 minutes (180 seconds) in localStorage
        const timerEndTime = new Date().getTime() + 180 * 1000;
        localStorage.setItem("otpTimerEndTime", timerEndTime.toString());
        
        // Navigate to email verification
        navigate("/email-verification");
      } else if (result.type === "auth/register/rejected") {
        const errorMessage = result.payload as string;
        if (errorMessage.includes("already exists")) {
          toast.error("Account already exists. Please try logging in instead.");
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
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
      top: "12%",
      left: "10%",
      delay: "0s",
      size: "w-3 h-3",
      color: "bg-valasys-orange/30",
    },
    {
      top: "28%",
      right: "18%",
      delay: "1s",
      size: "w-2 h-2",
      color: "bg-valasys-blue/40",
    } as any,
    {
      top: "42%",
      left: "6%",
      delay: "2s",
      size: "w-4 h-4",
      color: "bg-valasys-green/25",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-valasys-gray-50 via-white to-valasys-orange/5 lg:grid lg:grid-cols-2 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(255,106,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(26,115,232,0.12),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(0,196,140,0.12),transparent_40%)]"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-valasys-orange/25 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-valasys-blue/25 blur-3xl"></div>
        {aiElements.map((e, i) => (
          <div
            key={i}
            className={`absolute ${e.size} ${e.color} rounded-full animate-pulse`}
            style={{
              top: (e as any).top,
              left: (e as any).left,
              right: (e as any).right,
              animationDelay: (e as any).delay,
            }}
          />
        ))}
      </div>

      <div
        className={`flex items-center justify-center p-8 relative z-10 transform transition-all duration-700 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
      >
        <div className="w-full max-w-md space-y-6">
          <Card className="border-valasys-gray-200 shadow-xl hover:shadow-2xl transition-all duration-400 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-4 text-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F76d83d63beb8455692b1855a78aa9524%2F5ee47be8ea214f9c9b220b553ddb9ad1?format=webp&width=800"
                alt="Valasys AI Score logo"
                className="mx-auto h-12 w-auto object-contain mb-4"
              />
              <CardTitle className="text-lg font-semibold text-valasys-gray-900">
                Create Your Free Account
              </CardTitle>
              <p className="text-sm text-valasys-gray-600">
                Start your 5-day free trial to unlock actionable B2B insights.
              </p>
              {getBusinessEmail && (
                <p className="text-xs text-valasys-gray-500">
                  Creating account for: <span className="font-medium">{getBusinessEmail}</span>
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-valasys-gray-700 flex items-center space-x-1"
                    >
                      <User className="h-3 w-3" />
                      <span>First Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "first_name" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                      />
                      <Input
                        id="first_name"
                        placeholder="John"
                        {...register("first_name")}
                        onFocus={() => setFocusedField("first_name")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-valasys-gray-700 flex items-center space-x-1"
                    >
                      <User className="h-3 w-3" />
                      <span>Last Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "last_name" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                      />
                      <Input
                        id="last_name"
                        placeholder="Doe"
                        {...register("last_name")}
                        onFocus={() => setFocusedField("last_name")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company and Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-valasys-gray-700 flex items-center space-x-1"
                    >
                      <Building2 className="h-3 w-3" />
                      <span>Company Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building2
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "company" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                      />
                      <Input
                        id="company"
                        placeholder="Acme Inc."
                        {...register("company")}
                        onFocus={() => setFocusedField("company")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                      />
                      {errors.company && (
                        <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="designation"
                      className="text-valasys-gray-700 flex items-center space-x-1"
                    >
                      <Briefcase className="h-3 w-3" />
                      <span>Designation</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Briefcase
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "designation" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                      />
                      <Input
                        id="designation"
                        placeholder="Marketing Manager"
                        {...register("designation")}
                        onFocus={() => setFocusedField("designation")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                      />
                      {errors.designation && (
                        <p className="text-red-500 text-xs mt-1">{errors.designation.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label className="text-valasys-gray-700 flex items-center space-x-1">
                    <PhoneIcon className="h-3 w-3" />
                    <span>Phone Number</span>
                  </Label>
                  <div className="relative">
                    <PhoneInput
                      country={"us"}
                      value={watch("phone_number")}
                      onChange={(value) => setValue("phone_number", value)}
                      inputProps={{
                        name: "phone_number",
                        autoFocus: false,
                      }}
                      inputClass="form-control"
                      inputStyle={{
                        width: "100%",
                        padding: "12px 12px 12px 48px",
                        fontSize: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        backgroundColor: "#fff",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      buttonStyle={{
                        border: "1px solid #d1d5db",
                        backgroundColor: "#fff",
                        borderRadius: "6px 0 0 6px",
                      }}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>
                    )}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-valasys-gray-700 flex items-center space-x-1"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Password</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 ${focusedField === "password" ? "text-valasys-orange" : "text-valasys-gray-400"}`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-valasys-gray-400 hover:text-valasys-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      placeholder="••••••••"
                      {...register("re_password")}
                      onFocus={() => setFocusedField("re_password")}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-10 border-valasys-gray-300 focus:border-valasys-orange focus:ring-valasys-orange/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-valasys-gray-400 hover:text-valasys-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.re_password && (
                    <p className="text-red-500 text-xs mt-1">{errors.re_password.message}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={isCheckboxChecked}
                    onCheckedChange={(checked) => setIsCheckboxChecked(checked === true)}
                    className="mt-1 border-valasys-gray-300 text-valasys-orange focus:ring-valasys-orange/20"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-valasys-gray-700 cursor-pointer"
                  >
                    By signing up, you agree to our{" "}
                    <a
                      href="https://valasys.com/terms-and-conditions/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-valasys-orange hover:text-valasys-orange-light underline"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://valasys.com/privacy-policy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-valasys-orange hover:text-valasys-orange-light underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/free-trial")}
                    className="gap-2 border-valasys-gray-300 text-valasys-gray-700 hover:bg-valasys-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !(isValid && isDirty && isCheckboxChecked)}
                    className="bg-valasys-orange hover:bg-valasys-orange-light text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Already have account */}
              <div className="text-center pt-4 border-t border-valasys-gray-200">
                <p className="text-sm text-valasys-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-valasys-orange hover:text-valasys-orange-light font-medium transition-colors duration-200 hover:underline"
                  >
                    Back to Login
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Powered by 50+ Integrations (below form) */}
          <div className="pt-4">
            <IntegrationsFooter />
          </div>
        </div>
      </div>

      {/* Right Side - Keep same structure as other auth pages */}
      <div
        className={`hidden lg:flex relative bg-gradient-to-br from-valasys-orange/10 via-valasys-blue/10 to-valasys-green/10 backdrop-blur-sm transform transition-all duration-700 ${mounted ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-valasys-orange/15 via-valasys-orange-light/10 to-valasys-blue/15"></div>
        <div className="relative z-10 flex flex-col justify-center space-y-8 p-8 w-full">
          <div
            className={`space-y-4 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl font-bold text-valasys-gray-900">
              Join Thousands Using <span className="text-valasys-orange">VAIS</span>
            </h2>
            <p className="text-valasys-gray-600">
              Create your account and start leveraging AI-powered insights to 
              transform your sales process and accelerate business growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    AI-Powered Insights
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Advanced algorithms that deliver actionable intelligence
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Intelligent Scoring
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    AI-driven lead and account ranking for better targeting
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Campaign Optimization
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Smart campaign tracking with actionable reports
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg border border-valasys-orange text-valasys-orange flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-valasys-gray-900">
                    Real-time Dashboards
                  </div>
                  <p className="text-xs text-valasys-gray-600">
                    Live data processing and instant performance reporting
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`space-y-4 transform transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-valasys-gray-900 flex items-center justify-center space-x-2">
                <Play className="h-6 w-6 text-valasys-orange" />
                <span>See VAIS in Action</span>
              </h2>
              <p className="text-valasys-gray-600">
                Watch how AI transforms your sales process
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/10 backdrop-blur-sm border border-white/20">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-64 object-cover"
                poster="/placeholder.svg"
              >
                <source
                  src="https://cdn.builder.io/o/assets%2F30afb9e14ebd49aea9f5ae01cdf07930%2F8104f428ea2041e4b1e7817c489b1720?alt=media&token=183f0972-b931-4c24-bb07-a6086bd27c3a&apiKey=30afb9e14ebd49aea9f5ae01cdf07930"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
