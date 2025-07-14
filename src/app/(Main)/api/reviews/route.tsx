import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request: Request) {
  const authToken = await getToken();

  if (!authToken) {
    return NextResponse.json({ error: "Authentication required. Please log in.", redirect: "/login" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookId, rating, comment } = body;

    if (!bookId || !rating || !comment) {
      return NextResponse.json({ error: "Missing bookId, rating, or comment" }, { status: 400 });
    }

    const url = new URL(`${NEXT_PUBLIC_BACKEND_URL}/books/book_actions/${bookId}/submit_review/`);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend response:", text);
      return NextResponse.json({ error: "Failed to submit review" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authToken = await getToken();

  if (!authToken) {
    return NextResponse.json({ error: "Authentication required. Please log in.", redirect: "/login" }, { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const url = new URL(`${NEXT_PUBLIC_BACKEND_URL}/books/book_actions/reviews/`);
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId parameter" }, { status: 400 });
    }

    const fetchUrl = new URL(`${NEXT_PUBLIC_BACKEND_URL}/books/book_actions/${bookId}/reviews/`);
    const response = await fetch(fetchUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend response:", text);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}