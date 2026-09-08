// Middleware dinonaktifkan — auth guard sudah ditangani di masing-masing page:
// - /dashboard/page.tsx → cek session, redirect ke /auth/login jika tidak ada
// - /exam/[sessionId]/page.tsx → dibuka bebas, submit akan cek session user
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
