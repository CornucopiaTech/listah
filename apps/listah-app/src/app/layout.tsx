import type { Metadata } from "next";
import { StrictMode } from 'react';
import localFont from "next/font/local";
import { ThemeProvider } from '@mui/material/styles';


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
  title: "Listah",
  description: "List making application",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StrictMode>
        {/* <ThemeProvider
          theme={{
            palette: {
              primary: {
                main: '#007FFF',
                dark: '#0066CC',
              },
            },
          }}
        > */}
        {children}
        {/* </ThemeProvider> */}
        </StrictMode>


      </body>
    </html>
  );
}
