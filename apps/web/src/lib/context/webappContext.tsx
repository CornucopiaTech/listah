
import { createContext } from "react";



export const initalWebappContext: {
  userId: string,
  AppBarHeight: string,
} = {
  userId: "24f35fe6-5b72-466c-ae2f-2f27b5f4da00",
  // userId: "c4eaee5b-0c8e-4257-970f-39d6dbdeffa3",
  AppBarHeight: '64px',
};
export const WebAppContext = createContext(initalWebappContext);
