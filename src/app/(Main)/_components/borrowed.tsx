"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Toaster } from "react-hot-toast";

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: { id: number; name: string };
  genre: string;
  total_copies: number;
  available_copies: number;
  read_count: number;
  cover_image?: string;
}

const genreOptions = [
  { value: "", label: "All Genres" },
  { value: "FI", label: "Fiction" },
  { value: "NF", label: "Non-Fiction" },
  { value: "MY", label: "Mystery" },
  { value: "SF", label: "Science Fiction" },
  { value: "FA", label: "Fantasy" },
  { value: "BI", label: "Biography" },
  { value: "HI", label: "History" },
  { value: "RO", label: "Romance" },
  { value: "TH", label: "Thriller" },
  { value: "SH", label: "Self-Help" },
];

export default function MyBooks() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get("/api/borrow", {
          headers: { "Content-Type": "application/json" },
        });
        setBooks(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
          return;
        }
        console.error("Error fetching borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBorrowedBooks();
  }, [router]);

  const handleReturn = async (bookId: number) => {
    try {
      await axios.post(`/api/return/${bookId}`, {}, {
        headers: { "Content-Type": "application/json" },
      });
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
        return;
      }
      console.error("Error returning book:", error);
    }
  };

  if (loading) return <div className="text-center text-[#8B4513]">Loading...</div>;

  return (
    <div className="bg-[#F4E4BC] mt-20 p-4">
      <h2 className="text-3xl font-bold text-[#8B4513] mb-8 text-center">My Borrowed Books</h2>
      {books.length === 0 ? (
        <p className="text-[#8B4513] text-center">No books borrowed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFD700] p-6 transform hover:-translate-y-2"
            >
              {book.cover_image ? (
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#8B4513]">No Image Available</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-[#8B4513] mb-2">{book.title}</h3>
              <p className="text-[#8B4513]/80 mb-1">Author: {book.author.name}</p>
              <p className="text-[#8B4513]/80 mb-1">Genre: {genreOptions.find((g) => g.value === book.genre)?.label}</p>
              <p className="text-[#8B4513]/80 mb-1">Available: {book.available_copies} of {book.total_copies}</p>
              <p className="text-[#8B4513]/80 mb-4">Views: 👁️ {book.read_count}</p>
              <button
                onClick={() => handleReturn(book.id)}
                className="w-full py-3 bg-[#FFD700] text-[#8B4513] rounded-lg hover:bg-[#FFC107] transition-colors font-medium"
              >
                Return
              </button>
            </div>
          ))}
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}