import { Search, LayoutGrid, Plus, Loader2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { SidebarFooterComponent } from "./sidebar-footer";

import Link from "next/link";
import ThreadsLists from "./threads-list";
import { Suspense } from "react";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#171717] border-none text-sidebar-foreground transition-all duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader className="px-2 pt-3.5">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-lg shrink-0"
              priority
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger className="hover:bg-[#2f2f2f] text-[#b4b4b4] h-8 w-8 transition-colors" />
          </div>
        </div>
      </SidebarHeader>

      {/* REMOVED group-data-[collapsible=icon]:hidden from SidebarContent */}
      <SidebarContent className="px-1 mt-2">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
            {[
              { title: "New chat", icon: Plus, href: "/" },
              { title: "Search", icon: Search, href: "/" },
              { title: "Images", icon: LayoutGrid, href: "/" },
            ].map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="flex justify-cente relative"
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "h-9 transition-colors text-[#ececec] hover:bg-[#2f2f2f] data-[state=open]:bg-[#2f2f2f]",
                    // Centering logic for collapsed state
                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="ml-3 text-[14px] font-normal group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                  <Link
                    href={item.href}
                    className="absolute inset-0 cursor-pointer"
                  ></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* <Suspense fallback={<Loader2 />}> */}
          <ThreadsLists />
        {/* </Suspense> */}
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterComponent />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
