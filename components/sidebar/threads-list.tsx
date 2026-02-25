"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";


import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Thread = {
  title: string;
  id: string;
};

export function ThreadsLists() {
  const threadMenuContent = (
    <>
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <SidebarMenuItem
            key={item}
            className="group/item relative pointer-events-none"
          >
            <SidebarMenuButton
              className={cn(
                "h-9 rounded-lg transition-all px-3 pr-10 cursor-pointer",
                "hover:bg-transparent",
              )}
            >
              <Skeleton className="w-full h-full bg-[#212121]" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );

  return (
    <>
      <SidebarGroup className="p-0 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-[12px] font-medium text-[#b4b4b4] px-3 mb-1 mt-4">
          Recent
        </SidebarGroupLabel>
        <SidebarMenu className="gap-0.5">{threadMenuContent}</SidebarMenu>
      </SidebarGroup>
    </>
  );
}

export default ThreadsLists;
