import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import { UserProvider, useUser } from "@/context/AuthContext";
import AboutPage from "./pages/AboutPage";
import FranchisesPage from "./pages/FranchisesPage";
import HowItWorksPage from "./pages/HowItWorks";
import FranchiseDetailsPage from "./pages/Franchise";

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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/franchises" element={<FranchisesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/franchise/:id" element={<FranchiseDetailsPage />} />
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
