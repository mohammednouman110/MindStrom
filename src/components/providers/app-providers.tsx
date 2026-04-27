"use client";

import { ReactNode } from "react";
import { AppContextProvider } from "@/context/app-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
