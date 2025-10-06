import { Toaster } from "@/components/ui/sonner"
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper"
import { yekanBakh } from "@/lib/font"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${yekanBakh.variable} antialiased`}>
      <SessionProviderWrapper>
            <SidebarProvider dir="rtl">
                  <AppSidebar />

      <SidebarInset>
            {children}
                  </SidebarInset>

    </SidebarProvider>

        <Toaster />
      </SessionProviderWrapper>
    </div>
  )
}
