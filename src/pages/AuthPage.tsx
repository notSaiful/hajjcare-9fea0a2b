import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.jpeg";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signUp, signIn, isAuthenticated, loading } = useAuth();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    if (isSignUp) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: isRTL ? "خطأ" : "Error",
              description: isRTL ? "البريد الإلكتروني مسجل بالفعل" : "Email already registered",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: isRTL ? "تم إنشاء الحساب" : "Account created",
            description: isRTL ? "مرحباً بك في دليل الحج" : "Welcome to Hajj Guide",
          });
          navigate("/");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: isRTL ? "خطأ" : "Error",
            description: isRTL ? "بيانات الدخول غير صحيحة" : "Invalid credentials",
            variant: "destructive",
          });
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 sm:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      
      <div className="mb-4 sm:mb-6 animate-fade-up">
        <img src={logo} alt="Hajj Guide" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-glow" />
      </div>
      
      <Card className="w-full max-w-sm sm:max-w-md bg-card/90 backdrop-blur shadow-elevated animate-fade-up" style={{ animationDelay: "100ms" }}>
        <CardHeader className="text-center pb-2 px-4 sm:px-6">
          <CardTitle className="font-arabic text-xl sm:text-2xl">
            {isSignUp 
              ? (isRTL ? "إنشاء حساب" : "Create Account") 
              : (isRTL ? "تسجيل الدخول" : "Sign In")
            }
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isSignUp 
              ? (isRTL ? "انضم إلى دليل الحج الذكي" : "Join the AI Hajj Guide") 
              : (isRTL ? "أهلاً بعودتك" : "Welcome back")
            }
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {isSignUp && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={isRTL ? "الاسم الكامل" : "Full Name"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 sm:h-12 text-base"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}
            
            <div className="space-y-1.5 sm:space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 sm:h-12 text-base"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder={isRTL ? "كلمة المرور" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 sm:h-12 text-base"
                  dir="ltr"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full h-11 sm:h-12 text-base" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                isRTL ? "إنشاء حساب" : "Sign Up"
              ) : (
                isRTL ? "تسجيل الدخول" : "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? (isRTL ? "لديك حساب؟ سجل دخولك" : "Have an account? Sign in") 
                : (isRTL ? "ليس لديك حساب؟ أنشئ واحداً" : "No account? Sign up")
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
