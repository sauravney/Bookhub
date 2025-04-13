import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, ArrowRight, Users, Search, BookMarked } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Assume we check the user's session or local storage for the current user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("user");
      if (!token) return;

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(
          `https://bookhub-sauravneys-projects.vercel.app/api/auth/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();

        setCurrentUser({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-book-burgundy" />
            <span className="text-xl font-semibold">BookWorm Hub</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/browse")}
              className="text-sm font-medium"
            >
              Browse Books
            </Button>
          </nav>
        </div>
      </header>

      <main className="container flex-1">
        <div className="grid md:grid-cols-2 gap-12 py-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect with fellow book lovers
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Share, exchange, and discover books in your community with
              BookWorm Hub.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <BookMarked size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Share Your Books
                  </h3>
                  <p className="text-muted-foreground">
                    List books you're willing to share or exchange with others.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Find New Reads</h3>
                  <p className="text-muted-foreground">
                    Discover books in your area and connect with their owners.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Build Community
                  </h3>
                  <p className="text-muted-foreground">
                    Connect with fellow book lovers in your local area.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 hidden md:block">
              <Button onClick={() => navigate("/browse")} className="gap-2">
                Browse Available Books
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <AuthForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
