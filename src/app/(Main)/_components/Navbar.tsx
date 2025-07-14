"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth_check");
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth_check");
      setIsAuthenticated(false);
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
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex space-x-8">
          <span className="text-2xl font-extrabold tracking-wide">📚 Book Haven</span>
          <Link
            href="/MyBooks"
            className="text-lg hover:text-[#FFD700] transition-colors duration-300 font-semibold"
            onClick={handleMyBooksClick}
          >
            My Books
          </Link>
        </div>
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
    </nav>
  );
}