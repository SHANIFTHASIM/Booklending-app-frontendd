import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');
  const available_only = searchParams.get('available_only');
  const search = searchParams.get('search');

  const url = new URL('https://web-production-9f3a.up.railway.app/books/list/books/');
  if (genre) url.searchParams.append('genre', genre);
  if (available_only) url.searchParams.append('available_only', available_only);
  if (search) url.searchParams.append('search', search);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}