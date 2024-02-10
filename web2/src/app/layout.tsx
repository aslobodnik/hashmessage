import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import { Web3Modal } from "@/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Testifi",
  description: "I said, you said it, and know we know it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <Web3Modal initialState={initialState}>
        <body className={inter.className}>{children}</body>
      </Web3Modal>
    </html>
  );
}
