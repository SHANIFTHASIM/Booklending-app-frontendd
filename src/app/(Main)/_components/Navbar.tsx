"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth_check", { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth_check", {}, { withCredentials: true });
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMyBooksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <nav className="fixed w-full bg-[#8B4513] text-white shadow-lg z-20 py-3">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="text-2xl font-extrabold tracking-wide">📚 Book Haven</span>
          </Link>
          {/* My Books link on the left */}
          <Link
            href="/MyBooks"
            className="text-lg hover:text-[#FFD700] transition-colors duration-300 font-semibold hidden md:block"
            onClick={handleMyBooksClick}
          >
            My Books
          </Link>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
        {/* Desktop Auth Links */}
        <div className="hidden md:flex md:space-x-4">
          <div className="flex space-x-4">
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="bg-[#FFD700] text-[#8B4513] px-5 py-2 rounded-full hover:bg-[#FFC107] transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#FFD700]/80 text-[#8B4513] px-5 py-2 rounded-full hover:bg-[#FFD700] transition-all duration-300 font-medium"
                >
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full transition-all duration-300 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-12 right-6 bg-[#8B4513] p-4 rounded-lg shadow-lg flex flex-col space-y-2 z-50">
            <Link
              href="/MyBooks"
              className="text-lg hover:text-[#FFD700] transition-colors duration-300 font-semibold"
              onClick={handleMyBooksClick}
            >
              My Books
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="bg-[#FFD700] text-[#8B4513] px-5 py-2 rounded-full hover:bg-[#FFC107] transition-all duration-300 font-medium text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#FFD700]/80 text-[#8B4513] px-5 py-2 rounded-full hover:bg-[#FFD700] transition-all duration-300 font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full transition-all duration-300 font-medium text-center"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}