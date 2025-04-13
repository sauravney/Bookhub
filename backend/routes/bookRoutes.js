import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js"; // Import the User model
import authenticateUser from "../middleware/auth.js"; // Import the authentication middleware
import mongoose from "mongoose"; // Import mongoose for ObjectId conversion

const router = express.Router();

// Add a new book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body); // Create a new book from request body
    await book.save(); // Save the book to the database
    res.status(201).json(book); // Respond with the newly created book
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with error if something goes wrong
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ ownerId: userId });

    if (!books) {
      return res.status(404).json({ message: "Books not found" });
    }

    res.json(books); // Ensure this is an array of books
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.json(books); // Respond with all books
  } catch (err) {
    res.status(500).json({ message: err.message }); // Respond with error if something goes wrong
  }
});

// Update a book
router.put("/:id", async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated book instead of the original
    });
    if (!updated) {
      return res.status(404).json({ message: "Book not found" }); // If book doesn't exist
    }
    res.json(updated); // Respond with the updated book
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with error if something goes wrong
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id); // Delete the book by id
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" }); // If book doesn't exist
    }
    res.json({ message: "Book deleted" }); // Respond with success message
  } catch (err) {
    res.status(500).json({ message: err.message }); // Respond with error if something goes wrong
  }
});

// Toggle rent status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Find the book by id
    if (!book) {
      return res.status(404).json({ message: "Book not found" }); // If book doesn't exist
    }
    book.isRented = !book.isRented; // Toggle rent status
    await book.save(); // Save the updated book
    res.json(book); // Respond with the updated book
  } catch (err) {
    res.status(500).json({ message: err.message }); // Respond with error if something goes wrong
  }
});
router.post("/:bookId/save", authenticateUser, async (req, res) => {
  const userId = req.userId;
  const { bookId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the book ID is already in the savedBooks array
    if (!user.savedBooks.includes(bookId)) {
      user.savedBooks.push(bookId);
      await user.save();
    }

    // Log the savedBooks array after update
    console.log("User Saved Books after save:", user.savedBooks);

    res.status(200).json({ message: "Book saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Fetch all saved books for the current user
router.get("/saved-books/:userId", async (req, res) => {
  console.log("➡️  /saved-books route hit");

  try {
    const userId = req.params.userId;
    console.log("🧑‍💻 User ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid User ID format");
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User document:", user);

    if (!user.savedBooks || user.savedBooks.length === 0) {
      console.warn("⚠️ No saved books");
      return res.json([]);
    }

    const savedBookIds = user.savedBooks.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    console.log("📚 Book IDs to fetch:", savedBookIds);

    const savedBooks = await Book.find({ _id: { $in: savedBookIds } });

    console.log("✅ Saved Books found:", savedBooks.length);
    res.json(savedBooks);
  } catch (err) {
    console.error("🔥 Error in /saved-books route:", err);
    res.status(500).json({ message: "Failed to fetch saved books" });
  }
});

export default router;
