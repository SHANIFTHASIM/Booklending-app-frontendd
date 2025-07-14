"use client";

import Image from "next/image";
import { useState } from "react";

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

interface RecommendComponentProps {
  books: Book[];
  onBorrow: (bookId: number, duration: number) => void;
}

export default function RecommendComponent({ books, onBorrow }: RecommendComponentProps) {
  const [borrowDropdown, setBorrowDropdown] = useState<{ bookId: number; open: boolean } | null>(null);

  if (books.length === 0) {
    return (
      <div className="text-center text-[#8B4513] bg-white p-6 rounded-xl shadow-md mt-10">
        No recommendations available. Borrow or review a book to get suggestions!
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-[#8B4513] mb-8 text-center">Recommended Reads</h2>
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
            <div className="relative">
              <button
                disabled={book.available_copies === 0}
                onClick={() => setBorrowDropdown({ bookId: book.id, open: true })}
                className="w-full py-3 bg-[#FFD700] text-[#8B4513] rounded-lg hover:bg-[#FFC107] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Borrow
              </button>
              {borrowDropdown?.open && borrowDropdown.bookId === book.id && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-[#8B4513]/20 rounded-xl shadow-lg">
                  <button
                    onClick={() => { onBorrow(book.id, 1); setBorrowDropdown(null); }}
                    className="w-full text-left p-3 hover:bg-[#F4E4BC] rounded-t-lg text-[#8B4513] font-medium"
                  >
                    Borrow for 1 day
                  </button>
                  <button
                    onClick={() => { onBorrow(book.id, 3); setBorrowDropdown(null); }}
                    className="w-full text-left p-3 hover:bg-[#F4E4BC] text-[#8B4513] font-medium"
                  >
                    Borrow for 3 days
                  </button>
                  <button
                    onClick={() => { onBorrow(book.id, 7); setBorrowDropdown(null); }}
                    className="w-full text-left p-3 hover:bg-[#F4E4BC] rounded-b-lg text-[#8B4513] font-medium"
                  >
                    Borrow for 7 days
                  </button>
                  <button
                    onClick={() => setBorrowDropdown(null)}
                    className="w-full text-left p-3 hover:bg-[#F4E4BC] text-red-600 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}