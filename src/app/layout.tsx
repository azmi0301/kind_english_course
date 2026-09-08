import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Kind English Course — TOEFL Official Test Platform",
  description:
    "Official TOEFL Test Platform with Kind English Course. Institutional ITP tests, real-time timer, instant score analytics, and official certificate generation.",
  keywords: "TOEFL, ITP, English course, official test, test preparation",
  openGraph: {
    title: "Kind English Course — TOEFL Official Test Platform",
    description: "Official TOEFL Test Platform with Kind English Course.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
