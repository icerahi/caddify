import React from "react";
import DashboardProvider from "./Provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardProvider>{children}</DashboardProvider>
    </div>
  );
}
