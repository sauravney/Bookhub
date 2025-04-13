import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobile: String,
  role: { type: String, enum: ["owner", "seeker"] },
  savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
