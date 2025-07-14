
import { deleteTokens, getToken } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }
  // Optionally, validate token with Django backend
  return NextResponse.json({ isAuthenticated: true });
}

export async function POST() {
  await deleteTokens();
  return NextResponse.json({ isAuthenticated: false });
}