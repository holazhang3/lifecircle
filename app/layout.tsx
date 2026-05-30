import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LifeHub - 本地生活服务平台",
  description: "发现身边的精彩生活，汇聚本地优质服务，让您的生活更加便捷美好",
  keywords: "本地生活,招聘求职,房屋租赁,二手交易,本地商家,家政服务,搬家维修,宠物服务,教育培训,同城活动",
  authors: [{ name: "LifeHub Team" }],
  creator: "LifeHub",
  publisher: "LifeHub",
  formatDetection: {
    email: true,
    telephone: true,
  },
  openGraph: {
    title: "LifeHub - 本地生活服务平台",
    description: "发现身边的精彩生活，汇聚本地优质服务",
    type: "website",
    locale: "zh-CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeHub - 本地生活服务平台",
    description: "发现身边的精彩生活，汇聚本地优质服务",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
