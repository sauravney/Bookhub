import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { BookCard } from "@/components/books/BookCard";
import { Search } from "lucide-react";
import { toast } from "sonner";

const Browse = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const navigate = useNavigate();

  interface User {
    id: string;
    name: string;
    email?: string;
    role: string;
  }

  type Book = {
    id: string;
    _id?: string;
    title: string;
    author: string;
    genre?: string;
    location: string;
    contact: string;
    ownerId: string;
    ownerName: string;
    isRented: boolean;
    coverUrl?: string;
    createdAt: Date;
  };

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://bookhubb-jnsr.onrender.com/api/books",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data;
        if (Array.isArray(data)) {
          setBooks(data);
          setFilteredBooks(data);
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Decode user and fetch saved books
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.id;

      const fetchUser = async () => {
        const res = await fetch(
          `https://bookhubb-jnsr.onrender.com/api/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setCurrentUser({
          id: data._id,
          name: data.name,
          role: data.role,
        });
      };

      fetchUser();
    } catch (err) {
      console.error("Error decoding user:", err);
      localStorage.removeItem("user");
      setCurrentUser(null);
    }
  }, []);

  // Fetch saved books after currentUser is set
  useEffect(() => {
    const fetchSavedBooks = async () => {
      const token = localStorage.getItem("user");
      if (!token || !currentUser?.id) return;

      try {
        const res = await fetch(
          `https://bookhubb-jnsr.onrender.com/api/books/saved-books/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const savedBooks = await res.json();
          setSavedBookIds(savedBooks.map((book: any) => book._id));
        }
      } catch (error) {
        console.warn("Failed to fetch saved books:", error);
      }
    };

    if (currentUser?.id) {
      fetchSavedBooks();
    }
  }, [currentUser]);

  // Filters
  useEffect(() => {
    let result = Array.isArray(books) ? [...books] : [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.location.toLowerCase().includes(query)
      );
    }

    if (locationFilter) {
      result = result.filter((book) => book.location === locationFilter);
    }

    if (genreFilter) {
      result = result.filter((book) => book.genre === genreFilter);
    }

    setFilteredBooks(result);
  }, [books, searchQuery, locationFilter, genreFilter]);

  const handleDeleteBook = async (bookId: string) => {
    try {
      await axios.delete(`/api/books/${bookId}`);
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleSaveBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem("user");
      await axios.post(
        `https://bookhubb-jnsr.onrender.com/api/books/${bookId}/save`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedBookIds((prev) =>
        prev.includes(bookId) ? prev : [...prev, bookId]
      );
      toast.success("Book saved successfully!");
    } catch (error) {
      console.error("Failed to save book:", error);
      toast.error("Failed to save book");
    }
  };

  const handleToggleRent = async (bookId: string) => {
    try {
      await axios.patch(`/api/books/${bookId}/toggle-rent`);
      setBooks((prev) =>
        prev.map((book) =>
          book.id === bookId ? { ...book, isRented: !book.isRented } : book
        )
      );
    } catch (error) {
      console.error("Failed to toggle rent status:", error);
    }
  };

  const uniqueLocations = Array.from(
    new Set(books.map((book) => book.location))
  );
  const uniqueGenres = Array.from(
    new Set(books.filter((b) => b.genre).map((b) => b.genre!))
  );

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setGenreFilter("");
  };

  const currentUserId = currentUser?.id || "";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Browse Books</h1>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                {uniqueGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!searchQuery && !locationFilter && !genreFilter}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id || book.id}
                book={book}
                currentUserId={currentUserId}
                isManageable={book.ownerId === currentUserId}
                onDelete={handleDeleteBook}
                onSave={handleSaveBook}
                onToggleRent={handleToggleRent}
                isSaved={savedBookIds.includes(book._id || book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No books found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or clear the filters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
