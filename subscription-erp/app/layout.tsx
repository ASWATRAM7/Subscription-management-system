import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";
import { ConfirmProvider } from "./components/ConfirmProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Subscription Management ERP",
  description: "Complete subscription and billing management system for SaaS businesses",
  keywords: "ERP, Subscription Management, Billing, Invoicing, SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
