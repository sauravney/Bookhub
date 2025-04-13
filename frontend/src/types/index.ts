export type UserRole = "owner" | "seeker";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: UserRole;
  createdAt: Date;
}

export interface Book {
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
}

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface BookFormData {
  title: string;
  author: string;
  genre?: string;
  location: string;
  contact: string;
  coverUrl?: string;
}
