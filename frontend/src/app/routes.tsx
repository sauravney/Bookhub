
import { Routes, Route } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import HomePage from "./home/page";
import DashboardPage from "./dashboard/page";
import BrowsePage from "./browse/page";
import ProfilePage from "./profile/page";
import NotFoundPage from "./not-found";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
