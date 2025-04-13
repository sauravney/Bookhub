import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RootLayout } from "../layouts/RootLayout";
import { BookOpen, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "seeker";
  mobile: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("user");
      if (!token) return;

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(
          `http://localhost:5000/api/auth/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        setCurrentUser({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          mobile: data.mobile || "",
          createdAt: data.createdAt,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser && !loading) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      mobile: currentUser?.mobile || "",
    },
    values: {
      name: currentUser?.name || "",
      mobile: currentUser?.mobile || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const token = localStorage.getItem("user");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/${currentUser.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentUser((prevUser) =>
        prevUser ? { ...prevUser, ...res.data } : null
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color="#007bff" loading={loading} />
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <RootLayout>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser.email}
                    disabled
                  />
                  <FormDescription>
                    Email address cannot be changed
                  </FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Update Profile</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Account Type</h3>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                {currentUser.role === "owner" ? (
                  <>
                    <BookOpen className="h-5 w-5 text-book-burgundy" />
                    <span>Book Owner</span>
                  </>
                ) : (
                  <>
                    <UserCircle className="h-5 w-5 text-primary" />
                    <span>Book Seeker</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Member Since</h3>
              <p className="p-2 bg-muted rounded-md">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  toast.error("Account deletion not implemented in this demo");
                }}
              >
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This action is irreversible. All your data will be permanently
                deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
};

export default ProfilePage;
