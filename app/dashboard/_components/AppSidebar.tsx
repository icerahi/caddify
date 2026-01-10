"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import {
  Database,
  Gem,
  Headphones,
  LayoutDashboard,
  UserIcon,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const MenuOptions = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Agents",
    url: "/dashboard/my-agents",
    icon: Headphones,
  },
  {
    title: "Data",
    url: "#",
    icon: Database,
  },
  {
    title: "Pricing",
    url: "/dashboard/pricing",
    icon: WalletCards,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserIcon,
  },
];

function AppSidebar() {
  const { open } = useSidebar();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const pathname = usePathname();

  const { has } = useAuth();
  const isPaidUser = has && has({ plan: "unlimited_plan" });
  const [totalRemainingCredits, setTotalRemainingCredits] = useState<number>(0);

  const convex = useConvex();

  useEffect(() => {
    if (!isPaidUser && userDetail) getUserAgent();
  }, [isPaidUser]);

  const getUserAgent = async () => {
    const result = await convex.query(api.agent.GetUserAgents, {
      userId: userDetail?._id,
    });
    setTotalRemainingCredits(2 - Number(result?.length || 0));
    setUserDetail((prev: any) => ({
      ...prev,
      remainingCredits: 2 - Number(result?.length || 0),
    }));
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <Image src={"/logo.svg"} alt="logo" height={35} width={35} />
          {open && <h2 className="font-bold text-lg">Caddify</h2>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {MenuOptions.map((menu, index) => (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size={open ? "lg" : "default"}
                  isActive={pathname === menu.url}
                >
                  <Link href={menu.url}>
                    <menu.icon /> {menu.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="mb-10">
        {!isPaidUser ? (
          <div>
            <div className="flex gap-2 items-center">
              <Gem />
              {open && (
                <h2>
                  Remaining Credits:
                  <span className="font-bold">{totalRemainingCredits}/2</span>
                </h2>
              )}
            </div>
            {open && <Button className="mt-2">Upgrade to unlimited</Button>}
          </div>
        ) : (
          <div>
            <h2>You can create unlimited Agents</h2>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
