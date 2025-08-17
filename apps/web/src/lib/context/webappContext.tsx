"use client"

import { createContext } from "react";
export const initalWebappContext: {
  userId: string,
} = {
  userId: "002283d1-a82f-47ab-83e9-8f2e667f0d48",
};
export const WebAppContext = createContext(initalWebappContext);
