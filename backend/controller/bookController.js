const fs = require("fs");
const path = "./data/books.json";

function readBooks() {
  return JSON.parse(fs.readFileSync(path));
}

function writeBooks(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

exports.getAll = (req, res) => {
  res.json(readBooks());
};

exports.create = (req, res) => {
  const { title, author, genre, location, contact, owner } = req.body;
  const books = readBooks();

  books.push({
    title,
    author,
    genre,
    location,
    contact,
    owner,
    status: "Available",
  });
  writeBooks(books);
  res.status(201).json({ message: "Book listed" });
};

exports.toggleStatus = (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.title === req.params.title);
  if (book) {
    book.status =
      book.status === "Available" ? "Rented/Exchanged" : "Available";
    writeBooks(books);
    return res.json({ message: "Status updated" });
  }
  res.status(404).json({ message: "Book not found" });
};

exports.deleteBook = (req, res) => {
  let books = readBooks();
  books = books.filter((b) => b.title !== req.params.title);
  writeBooks(books);
  res.json({ message: "Deleted" });
};
