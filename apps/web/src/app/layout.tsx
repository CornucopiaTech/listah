
import type { Metadata } from "next";
import {
  Fragment,
  ReactNode
} from 'react';
import {
  ClerkProvider,
} from '@clerk/nextjs';

import {
  CssBaseline,
  Box,
  Container
} from '@mui/material';
import { enableMapSet } from 'immer';

import "./globals.css";
import '@/envConfig.ts';

enableMapSet()
export const metadata: Metadata = {
  title: "Listah",
  description: "List tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Fragment>
      {/* <ClerkProvider> */}
          <CssBaseline />
          <html lang="en">
            <head>
            </head>
            <body>
              <Box sx={{ minHeight: '720px', height: '100%' }}>
                <Container maxWidth="lg">
                  {children}
                </Container>
              </Box>
            </body>
          </html>
      {/* </ClerkProvider> */}
    </Fragment>
  );
}
