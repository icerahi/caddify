import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";

function DashboardProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppHeader />
        {children}
      </div>
    </SidebarProvider>
  );
}
export default DashboardProvider;
