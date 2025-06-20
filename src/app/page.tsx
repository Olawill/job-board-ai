import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarClient } from "@/components/_AppSidebarClient";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { SignedOutStatus } from "@/services/clerk/components/SignedOutStatus";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SignedInStatus } from "@/services/clerk/components/SignedInStatus";

const Home = () => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-lg font-bold text-nowrap">Poder Jobs</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
            <SidebarMenu>
              <SignedOutStatus>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/sign-in">
                      <LogInIcon />
                      <span>Log In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedOutStatus>
            </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SignedInStatus>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarUserButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedInStatus>
        </Sidebar>
      <main className="flex-1">Children</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}

export default Home