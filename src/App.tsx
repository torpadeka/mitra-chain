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
import FranchiseeDetailPage from "./pages/dashboard/FranchiseeDetailPage";
import FranchisorFranchiseDetailPage from "./pages/dashboard/FranchisorDetailPage";
import { Navigation } from "./components/navigation";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/events/EventsPage";
import CreateEventPage from "./pages/events/CreateEventPage";
import EventDetailPage from "./pages/events/EventDetailPage";
import { Toaster } from "sonner";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";

const App: React.FC = () => {
  const {
    user,
    setUser,
    getUser,
    actor,
    principal,
    isAuthenticated,
    saveToSession,
    loadFromSession,
  } = useUser();

  useEffect(() => {
    const restoreUser = async () => {
      console.log(principal);
      if (!user && actor && principal) {
        try {
          const fetchedUser = await getUser(principal);
          console.log("Restored user:", fetchedUser);
          console.log(actor);
          if (fetchedUser) {
            setUser(fetchedUser);
            saveToSession(fetchedUser, true, principal.toString());
            console.log(loadFromSession());
            console.log("Ada user.");
          } else {
            saveToSession(null, false, principal.toString());
            console.warn("No user found, session cleared.");
          }
        } catch (err) {
          console.error("Failed to restore user:", err);
        }
      }
    };

    restoreUser();
  }, [actor, principal, isAuthenticated, setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* <Route path="/test" element={<TestPage />} /> */}
          <Route path="/franchises" element={<FranchisesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/franchise/:id" element={<FranchiseDetailsPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
          <Route
            path="/dashboard/franchisee"
            element={<FranchiseeDashboard />}
          />
          <Route
            path="/dashboard/franchisee/chat/:conversationId"
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
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default () => (
  <UserProvider>
    <App />
    <Toaster />
  </UserProvider>
);
