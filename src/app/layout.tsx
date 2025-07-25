import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import 'react-quill-new/dist/quill.snow.css';
import Header from "@/components/Header";
import React from "react";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Best Buy| Home page",
    description: "Shop the latest electronics, appliances, and gadgets at Best Buy. Discover unbeatable deals and top-quality products for your home and lifestyle.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >


        <Header/>
        {children}
        <Footer/>

        </body>
        </html>
    );
}
