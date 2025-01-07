"use client";

import { ReactNode } from "react";
import DashboardWrapper from "./dashboardWrapper";
import { AuthProvider } from "@/context/authContext";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardWrapper>{children}</DashboardWrapper>
    </AuthProvider>
  );
}
