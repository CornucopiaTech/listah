
import type { Metadata } from "next";
import * as React from 'react';
import {
  ClerkProvider,
} from '@clerk/nextjs';

import {
  CssBaseline,
  Box,
  Container
} from '@mui/material';


import "./globals.css";
import '@/envConfig.ts';


export const metadata: Metadata = {
  title: "Listah",
  description: "List tracking application",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <ClerkProvider>
        <CssBaseline />
        <html lang="en">
          <head>
          </head>
          <body>
            <Box sx={{ bgcolor: '#cfe8fc', minHeight: '720px', height: '100%' }}>
              <Container maxWidth="lg">
                {children}
              </Container>
            </Box>
          </body>
        </html>
      </ClerkProvider>
    </React.Fragment>
  );
}
