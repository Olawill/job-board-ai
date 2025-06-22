import { AppSidebarClient } from "@/components/sidebar/_AppSidebarClient";
import { SignedInStatus } from "@/services/clerk/components/SignedInStatus";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const AppSidebar = ({
  content,
  footerButton,
  children,
}: {
  content: React.ReactNode;
  footerButton: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-lg font-bold text-nowrap">Poder Jobs</span>
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedInStatus>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedInStatus>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};
