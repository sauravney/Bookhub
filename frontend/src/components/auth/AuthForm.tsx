import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, UserCircle } from "lucide-react";
import { toast } from "sonner"; // Optional toast for feedback

const API_BASE_URL = "https://bookhubb-jnsr.onrender.com"; // replace with your backend base URL

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  role: z.enum(["owner", "seeker"], { required_error: "Please select a role" }),
  savedBooks: z.array(z.string()).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
      role: "seeker",
      savedBooks: [],
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Login failed");
        return;
      }

      localStorage.setItem("user", result.token);

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }

      toast.success("Registration successful. Please log in.");
      setIsLogin(true);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Login to BookWorm Hub" : "Create an Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Join our community of book lovers"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin ? (
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...loginForm.register("email")} />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...registerForm.register("name")} />
              {registerForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...registerForm.register("email")}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" {...registerForm.register("mobile")} />
              {registerForm.formState.errors.mobile && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.mobile.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label>I am a:</Label>
              <RadioGroup
                defaultValue={registerForm.getValues("role")}
                onValueChange={(value) =>
                  registerForm.setValue("role", value as any)
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner" id="owner" />
                  <Label
                    htmlFor="owner"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen size={16} />
                    Book Owner
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seeker" id="seeker" />
                  <Label
                    htmlFor="seeker"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <UserCircle size={16} />
                    Book Seeker
                  </Label>
                </div>
              </RadioGroup>
              {registerForm.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.role.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          className="w-full"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
