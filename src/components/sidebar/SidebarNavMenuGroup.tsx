"use client";

import Link from "next/link";

import { SignedInStatus } from "@/services/clerk/components/SignedInStatus";
import { SignedOutStatus } from "@/services/clerk/components/SignedOutStatus";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export const SidebarNavMenuGroup = ({
  items,
  className,
}: {
  items: {
    href: string;
    icon: React.ReactNode;
    label: string;
    authStatus?: "signedOut" | "signedIn";
  }[];
  className?: string;
}) => {
  const pathname = usePathname();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => {
          const html = (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          if (item.authStatus === "signedOut") {
            return <SignedOutStatus key={item.href}>{html}</SignedOutStatus>;
          }

          if (item.authStatus === "signedIn") {
            return <SignedInStatus key={item.href}>{html}</SignedInStatus>;
          }

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
