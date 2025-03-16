
import type { Metadata } from "next";
import * as React from 'react';
import {
  CssBaseline,
  Box,
  Container
} from '@mui/material';
import {
  ClerkProvider,
} from '@clerk/nextjs';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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
      <CssBaseline />
      <ClerkProvider>
        <html lang="en">
          <head>
          </head>
          <body>
            <Box sx={{ bgcolor: '#cfe8fc', minHeight: '720px',  height: '100%' }}>
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
