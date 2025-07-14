import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const authToken = await getToken();

  if (!authToken) {
    return NextResponse.json(
      { error: "Authentication required. Please log in.", redirect: "/login" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { duration } = body;

    const url = new URL(`${NEXT_PUBLIC_BACKEND_URL}/books/book_actions/${id}/`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({ duration }), // Forward duration
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}