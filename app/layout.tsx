import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RYSERA HR — AI-Powered Talent Solutions",
  description:
    "Submit your CV for AI-powered evaluation and grading. Our intelligent HR system analyzes your qualifications against the job requirements.",
  keywords: "CV screening, AI recruitment, job application, HR automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
