"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, ChevronDown, Sun, Moon } from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NoPP from "../assets/no_pp.webp";
import { useOisyWallet } from "@/hooks/useOisyWallet";
import { useTheme } from "@/hooks/useTheme";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, isAuthenticated, isInitializing, principal, logout } =
    useUser();
  const navigate = useNavigate();
  const { connect, disconnect, isConnected } = useOisyWallet();
  const { theme, toggleTheme } = useTheme();

  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    if (!user || !isAuthenticated) return null;
    if (user.role === "Franchisee") return "/dashboard/franchisee";
    if (user.role === "Franchisor") return "/dashboard/franchisor";
    if (user.role === "Admin") return "/dashboard/admin";
    return "/dashboard/franchisee";
  };

  const dashboardPath = getDashboardPath();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/franchises", label: "Browse Franchises" },
    { href: "/events", label: "Events" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About Us" },
  ];

  const handleLogout = async () => {
    logout(() => {
      window.location.reload();
    });
  };

  if (isInitializing) {
    return (
      <nav className="bg-background-primary shadow-lg border-b border-brand-200 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex items-center space-x-3 group">
              {/* <div className="relative w-20 h-20 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <img
                  src="/MitraChainTextLogo.png"
                  alt="MitraChain Logo"
                  width={32}
                  height={32}
                  className="object-cover w-20 h-20"
                />
              </div> */}
              <span className="text-inverse font-bold text-sm font-jetbrains-mono">
                M
              </span>
            </a>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background shadow-lg border-b-2 border-brand-400 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center space-x-3 group">
            {/* <div className="relative w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <img
                src="/MitraChainTextLogo.png"
                alt="MitraChain Logo"
                width={32}
                height={32}
                className="object-cover h-10= w-10 rounded-full shadow-md"
              />
            </div> */}
            <span className="text-primary font-bold text-2xl font-jetbrains-mono italic">
              MitraChain
            </span>
          </a>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="
                  relative px-4 py-2 font-medium text-primary rounded-lg
                  transition-all duration-300 ease-in-out
                  hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-400/30
                  after:absolute after:left-1/2 after:bottom-0 
                  after:h-0.5 after:w-0 after:bg-brand-600 dark:after:bg-brand-400
                  after:transition-all after:duration-300 after:transform after:-translate-x-1/2
                  hover:after:w-3/4
                "
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop user section */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </Button>

            {user == null ? (
              <Button
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={login}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary transition-colors duration-200">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-200 dark:border-neutral-600 hover:border-brand-400 dark:hover:border-brand-400 transition-colors">
                        <img
                          src={user?.profilePicUrl || NoPP}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-secondary"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                      Profile
                    </DropdownMenuItem>
                    {dashboardPath && (
                      <DropdownMenuItem
                        onClick={() => navigate(dashboardPath)}
                        className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      >
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  className={`font-medium px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    isConnected
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-brand-600 hover:bg-brand-700 text-white"
                  }`}
                  onClick={isConnected ? disconnect : connect}
                >
                  {isConnected ? "Disconnect OISY" : "Connect OISY"}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-neutral-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-neutral-800 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-brand-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <div className="px-2 pt-4 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-foreground dark:text-neutral-200 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-4 mt-4 border-t border-brand-200 dark:border-neutral-700 space-y-3">
                {user == null ? (
                  <Button
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-300"
                    onClick={() => {
                      login();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-brand-50 dark:bg-neutral-800 rounded-lg">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-200 dark:border-neutral-600">
                        <img
                          src={user?.profilePicUrl || NoPP}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                          User Profile
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Manage your account
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 dark:hover:bg-neutral-800 py-3 bg-transparent"
                      onClick={() => {
                        navigate("/profile");
                        setIsMenuOpen(false);
                      }}
                    >
                      View Profile
                    </Button>

                    {dashboardPath && (
                      <Button
                        variant="outline"
                        className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 dark:hover:bg-neutral-800 py-3 bg-transparent"
                        onClick={() => {
                          navigate(dashboardPath);
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                    )}

                    <Button
                      className={`w-full font-medium py-3 rounded-lg transition-all duration-300 ${
                        isConnected
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-brand-600 hover:bg-brand-700 text-white"
                      }`}
                      onClick={() => {
                        isConnected ? disconnect() : connect();
                        setIsMenuOpen(false);
                      }}
                    >
                      {isConnected ? "Disconnect OISY" : "Connect OISY"}
                    </Button>

                    <Button
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 py-3"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
