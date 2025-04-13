import { Book } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  MapPin,
  User,
  Mail,
  Phone,
  Trash,
  Check,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  isManageable?: boolean;
  currentUserId?: string;
  onDelete: (bookId: string) => void;
  onToggleRent: (bookId: string) => void;
  onSave?: (bookId: string) => void;
  isSaved?: boolean;
}

export function BookCard({
  book,
  isManageable = false,
  currentUserId,
  onDelete,
  onToggleRent,
  onSave,
  isSaved = false,
}: BookCardProps) {
  const isOwner = currentUserId === book.ownerId;

  const contactInfo = book.contact.includes("@") ? (
    <div className="flex items-center gap-1.5">
      <Mail className="h-4 w-4" />
      <a
        href={`mailto:${book.contact}`}
        className="text-blue-600 hover:underline"
      >
        {book.contact}
      </a>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <Phone className="h-4 w-4" />
      <a href={`tel:${book.contact}`} className="text-blue-600 hover:underline">
        {book.contact}
      </a>
    </div>
  );

  return (
    <Card className={cn("book-card", book.isRented && "opacity-70")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{book.title}</CardTitle>
          <Badge
            variant={book.isRented ? "outline" : "default"}
            className={
              book.isRented
                ? "bg-muted"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            }
          >
            {book.isRented ? "Exchanged/Rented" : "Available"}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          {book.author}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2 space-y-2">
        {book.genre && (
          <div className="text-sm">
            <Badge variant="secondary" className="mr-2">
              {book.genre}
            </Badge>
          </div>
        )}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {book.location}
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {book.ownerName}
          </div>
          {contactInfo}
          {onSave && (
            <Button
              variant="secondary"
              onClick={() => onSave(book._id)}
              disabled={isSaved}
              className="mt-2"
            >
              Save Book
            </Button>
          )}
        </div>
      </CardContent>

      {isManageable && isOwner && (
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleRent(book.id)}
            className={book.isRented ? "text-orange-600" : "text-green-600"}
          >
            {book.isRented ? (
              <>
                <X className="h-4 w-4 mr-1" /> Mark Available
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" /> Mark Exchanged
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-600">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  book listing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(book.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
