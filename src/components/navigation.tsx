"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, isAuthenticated, principal, logout } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/franchises", label: "Browse Franchises" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About Us" },
  ];

  const handleLogout = async () => {
    logout(() => {
      window.location.reload();
    });
  };

  return (
    <nav className="bg-surface-primary shadow-sm border-b border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-serif font-bold text-xl text-primary">
              MitraChain
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-secondary hover:text-brand font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user == null ? (
              <Button className="btn-primary" onClick={login}>
                <Wallet className="w-4 h-4 mr-2" />
                Login
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full overflow-hidden border border-primary focus:outline-none">
                    <img
                      src={
                        user?.profilePicUrl ||
                        "https://res.cloudinary.com/dqvlnzw9f/image/upload/v1755615357/no_pp_gjtf75.jpg"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-secondary hover:text-brand font-medium transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-primary">
                {user == null ? (
                  <Button className="btn-primary" onClick={login}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-9 h-9 rounded-full overflow-hidden border border-primary focus:outline-none">
                        <img
                          src={
                            user?.profilePicUrl ||
                            "https://res.cloudinary.com/dqvlnzw9f/image/upload/v1755615357/no_pp_gjtf75.jpg"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-500"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
