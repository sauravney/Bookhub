import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Props types
type BookFormProps = {
  currentUser: {
    id: string;
    name: string;
  };
  onAddBook: (book: any) => void;
};

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  contact: z.string().min(1, "Contact information is required"),
  coverUrl: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

const genres = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Children",
  "Young Adult",
  "Poetry",
  "Comics/Graphic Novels",
  "Other",
];

export function BookForm({ currentUser, onAddBook }: BookFormProps) {
  const navigate = useNavigate();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      location: "",
      contact: "",
      coverUrl: "",
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    const token = localStorage.getItem("user");

    const bookWithOwner = {
      ...data,
      isRented: false,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
    };

    try {
      const response = await fetch(
        "https://bookhubb-jnsr.onrender.com/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookWithOwner),
        }
      );

      if (!response.ok) throw new Error("Failed to add book");

      const savedBook = await response.json();
      onAddBook(savedBook); // update book list in Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add a New Book</CardTitle>
        <CardDescription>List your book for exchange or rent</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Book Title</Label>
            <Input
              id="title"
              placeholder="Enter the book title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Enter the author's name"
              {...form.register("author")}
            />
            {form.formState.errors.author && (
              <p className="text-sm text-destructive">
                {form.formState.errors.author.message}
              </p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre (Optional)</Label>
            <Select
              onValueChange={(value) => form.setValue("genre", value)}
              defaultValue={form.getValues("genre")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location/City</Label>
            <Input
              id="location"
              placeholder="Enter your city or location"
              {...form.register("location")}
            />
            {form.formState.errors.location && (
              <p className="text-sm text-destructive">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information</Label>
            <Input
              id="contact"
              placeholder="Email or phone number"
              {...form.register("contact")}
            />
            <p className="text-xs text-muted-foreground">
              This will be visible to others. Enter an email or phone number.
            </p>
            {form.formState.errors.contact && (
              <p className="text-sm text-destructive">
                {form.formState.errors.contact.message}
              </p>
            )}
          </div>

          {/* Cover URL */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Book Cover URL (Optional)</Label>
            <Input
              id="coverUrl"
              placeholder="https://example.com/book-cover.jpg"
              {...form.register("coverUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to an image of the book cover.
            </p>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full">
              Add Book
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
