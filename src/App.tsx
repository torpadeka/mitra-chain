import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import { UserProvider, useUser } from "@/context/AuthContext";
import AboutPage from "./pages/AboutPage";
import FranchisesPage from "./pages/FranchisesPage";
import HowItWorksPage from "./pages/HowItWorks";
import FranchiseDetailsPage from "./pages/Franchise";
import FranchiseeDashboard from "./pages/dashboard/FranchiseeDashboardPage";
import FranchisorDashboard from "./pages/dashboard/FranchisorDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import FranchiseDetailPage from "./pages/dashboard/FranchiseeDetailPage";
import FranchiseeDetailPage from "./pages/dashboard/FranchiseeDetailPage";
import FranchisorFranchiseDetailPage from "./pages/dashboard/FranchisorDetailPage";
import { Navigation } from "./components/navigation";
import RegisterPage from "./pages/RegisterPage";
import TestPage from "./pages/TestPage";

const App: React.FC = () => {
  const { user, setUser, getUser, actor, principal, isAuthenticated } =
    useUser();

  useEffect(() => {
    const restoreUser = async () => {
      // Only attempt to restore user if authenticated, actor and principal are available, and no user is set
      if (!user && actor && principal && isAuthenticated) {
        try {
          const fetchedUser = await getUser(principal);
          if (fetchedUser) {
            setUser(fetchedUser);
          }
        } catch (err) {
          console.error("Failed to restore user:", err);
        }
      }
    };

    restoreUser();
  }, [actor, principal, isAuthenticated, setUser]); // Removed 'user' from dependencies

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/franchises" element={<FranchisesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/franchise/:id" element={<FranchiseDetailsPage />} />
          <Route
            path="/dashboard/franchisee"
            element={<FranchiseeDashboard />}
          />
          <Route
            path="/dashboard/franchisor"
            element={<FranchisorDashboard />}
          />
          <Route
            path="/dashboard/franchisee/franchise/:id"
            element={<FranchiseeDetailPage />}
          />
          <Route
            path="/dashboard/franchisor/franchise/:id"
            element={<FranchisorFranchiseDetailPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default () => (
  <UserProvider>
    <App />
  </UserProvider>
);
