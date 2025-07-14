// app/api/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { data } = await axios.post("https://web-production-9f3a.up.railway.app/api/token/", body, {
      headers: { "Content-Type": "application/json" },
    });

    const { access } = data;

    const response = NextResponse.json({ loggedIn: true });

    response.cookies.set({
      name: "auth-token",
      value: access,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;

  } catch (err: unknown) {
    let message = "Invalid credentials";
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err.response) === 'object' &&
      err.response !== null &&
      'data' in (err.response as object)
    ) {
      // TypeScript type guard for error with response.data
      const errorWithResponse = err as { response: { data?: { detail?: string }; message?: string } };
      message = errorWithResponse.response.data?.detail || message;
      console.error("Login error:", errorWithResponse.response.data || errorWithResponse.response.message);
    } else if (err instanceof Error) {
      console.error("Login error:", err.message);
    }
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
