"use client"

import { createContext } from "react";
export const initalWebappContext: {
  userId: string,
} = {
  userId: "24f35fe6-5b72-466c-ae2f-2f27b5f4da00",
};
export const WebAppContext = createContext(initalWebappContext);
