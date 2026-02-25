import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { headers } from "next/headers";
import { SessionUser } from "@/types";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { ChevronDown, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { UpgradeComponent } from "@/components/upgrade-component";
import { ModelSelectorComponent } from "@/components/model-selector";

export default async function ChatPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-dvh  bg-[#212121] text-[#ececec]">
            <header className="flex items-center justify-between px-4 py-3 h-15 shrink-0">
              <div className="flex md:hidden">
                <SidebarTrigger />
              </div>
              <div className="items-center hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-[18px] font-semibold hover:bg-[#2f2f2f] text-[#b4b4b4] px-2 py-1 h-auto flex items-center gap-1 focus-visible:ring-0"
                    >
                      CodersGPT <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#2f2f2f] border-[#424242] text-white rounded-xl p-2 min-w-50">
                    <DropdownMenuItem className="rounded-lg focus:bg-[#424242]">
                      CodersGPT Plus
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg focus:bg-[#424242]">
                      CodersGPT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <UpgradeComponent />

              <div className="flex items-center">
                <ModelSelectorComponent />
              </div>
            </header>

            <main className="flex-1 min-h-0 relative flex flex-col">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}
