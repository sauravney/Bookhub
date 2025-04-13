import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import authenticateUser from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Add a new book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await Book.find({ ownerId: userId });

    if (!books) {
      return res.status(404).json({ message: "Books not found" });
    }

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a book
router.put("/:id", async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle rent status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.isRented = !book.isRented;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    console.log("User ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
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
    const savedBooks = await Book.find({ _id: { $in: savedBookIds } });
    res.json(savedBooks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved books" });
  }
});

export default router;
