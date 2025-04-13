import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  location: String,
  contact: String,
  ownerId: String,
  ownerName: String,
  isRented: { type: Boolean, default: false },
  coverUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
