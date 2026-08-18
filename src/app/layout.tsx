import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AD-CNT | سامانه مدیریت سازمان",
  description: "سامانه مدیریت منابع، نیروی انسانی و عملیات شرکت",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
