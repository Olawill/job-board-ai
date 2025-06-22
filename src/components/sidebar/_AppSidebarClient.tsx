"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppSidebarClient = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useIsMobile();
  
    if (!isMobile) {
      return children;
    }
  
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-1">
          <SidebarTrigger/>
          <span className="text-lg font-bold">Poder Jobs</span>
        </div>
        <div className="flex-1 flex">{children}</div>
      </div>
    )
}
