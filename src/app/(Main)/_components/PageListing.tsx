"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RecommendComponent from "./RecommendComponent";
import Image from "next/image";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

// Define interfaces
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

interface Review {
  id: number;
  user?: string;
  rating: number;
  comment: string;
  created_at: string;
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

const renderStars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

export default function PageListing() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [showAvailable, setShowAvailable] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [reviewBookId, setReviewBookId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [borrowDropdown, setBorrowDropdown] = useState<{ bookId: number; open: boolean } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewsModal, setShowReviewsModal] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/list_books/?genre=${selectedGenre}&available_only=${showAvailable}&search=${authorFilter}`);
        setBooks(response.data);

        const recommendResponse = await axios.get("/api/recommend", {
          headers: { "Content-Type": "application/json" },
        });
        if (recommendResponse.status === 401) {
          router.push("/login");
          return;
        }
        setRecommendedBooks(recommendResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
          return;
        }
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedGenre, authorFilter, showAvailable, router]);

  const handleBorrow = async (bookId: number, duration: number) => {
    try {
      const response = await axios.post(`/api/borrow/${bookId}`, { duration }, {
        headers: { "Content-Type": "application/json" },
      });
      const updatedBook = books.find((book) => book.id === bookId);
      setBooks(books.map((book) => (book.id === bookId ? { ...updatedBook, ...response.data } : book)));
      setBorrowDropdown(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("You’ve already borrowed this book or an error occurred!");
        setBorrowDropdown(null);
      }
      console.error("Error borrowing book:", error);
    }
  };

  const handleSubmitReview = async (bookId: number) => {
    try {
      const response = await axios.post("/api/reviews", { bookId, rating, comment }, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      setReviewBookId(null);
      setRating(0);
      setComment("");
      await handleListReviews(bookId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Review submission failed:", error.response?.data);
      }
      console.error("Error submitting review:", error);
    }
  };

  const handleListReviews = async (bookId: number) => {
    try {
      const response = await axios.get(`/api/reviews?bookId=${bookId}`, {
        headers: { "Content-Type": "application/json" },
      });
      setReviews(response.data);
      setShowReviewsModal(bookId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Review fetch failed:", error.response?.data);
      }
      console.error("Error fetching reviews:", error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const genreMatch = !selectedGenre || book.genre === selectedGenre;
    const authorMatch = !authorFilter || (book.author && book.author.name.toLowerCase().includes(authorFilter.toLowerCase()));
    const availabilityMatch = !showAvailable || book.available_copies > 0;
    return genreMatch && authorMatch && availabilityMatch;
  });

  if (loading) return <div className="text-center text-[#8B4513]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F4E4BC] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="p-3 border-2 border-[#8B4513] rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-white"
            >
              {genreOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#F4E4BC]">
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filter by author..."
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="p-3 border-2 border-[#8B4513] rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-white"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAvailable}
                onChange={(e) => setShowAvailable(e.target.checked)}
                className="w-5 h-5 text-[#FFD700] focus:ring-[#FFD700] border-[#8B4513]"
              />
              <span className="text-[#8B4513] font-medium">Available Only</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
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
                      onClick={() => { handleBorrow(book.id, 1); setBorrowDropdown(null); }}
                      className="w-full text-left p-3 hover:bg-[#F4E4BC] rounded-t-lg text-[#8B4513] font-medium"
                    >
                      Borrow for 1 day
                    </button>
                    <button
                      onClick={() => { handleBorrow(book.id, 3); setBorrowDropdown(null); }}
                      className="w-full text-left p-3 hover:bg-[#F4E4BC] text-[#8B4513] font-medium"
                    >
                      Borrow for 3 days
                    </button>
                    <button
                      onClick={() => { handleBorrow(book.id, 7); setBorrowDropdown(null); }}
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
              <button
                onClick={() => setReviewBookId(book.id)}
                className="w-full mt-4 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B2E0E] transition-colors font-medium"
              >
                Add Review
              </button>
              <button
                onClick={() => handleListReviews(book.id)}
                className="w-full mt-2 py-3 bg-[#FFD700] text-[#8B4513] rounded-lg hover:bg-[#FFC107] transition-colors font-medium"
              >
                View Reviews
              </button>
            </div>
          ))}
        </div>
        <RecommendComponent books={recommendedBooks} onBorrow={handleBorrow} />
      </div>

      {/* Review Modal */}
      {(reviewBookId || showReviewsModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            {reviewBookId && (
              <>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Add Review</h3>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full p-3 border-2 border-[#8B4513] rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-white mb-4"
                >
                  <option value="0">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r} className="bg-[#F4E4BC]">
                      {r} Stars
                    </option>
                  ))}
                </select>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border-2 border-[#8B4513] rounded-lg text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-white mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmitReview(reviewBookId)}
                    className="flex-1 py-2 bg-[#FFD700] text-[#8B4513] rounded-lg hover:bg-[#FFC107] transition-colors font-medium"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => setReviewBookId(null)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {showReviewsModal && (
              <>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-4">Reviews</h3>
                {reviews.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="mb-4 p-2 border-b border-[#8B4513]/20 last:border-b-0">
                        <p className="text-[#8B4513]">
                          <strong>{review.user || "Anonymous"}</strong> rated:{" "}
                          <span className="text-[#FFD700]">{renderStars(review.rating)}</span>
                        </p>
                        {review.comment && <p className="text-[#8B4513]/80 mt-1">{review.comment}</p>}
                        <p className="text-sm text-[#8B4513]/60 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#8B4513]/80">No reviews yet.</p>
                )}
                <button
                  onClick={() => setShowReviewsModal(null)}
                  className="w-full mt-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}