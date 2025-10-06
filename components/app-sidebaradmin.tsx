"use client"
import { useSession } from 'next-auth/react'


import * as React from "react"
import {
  Command,
  DollarSign,
  PercentCircle,
  PhoneCall,
  SquareTerminal,
  Users2Icon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "مدیریت آزمون",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: " همه آزمون ها",
          url: "/admin/exam",
        },
        // {
        //   title: "آزمون های من",
        //   url: "#",
        // },
        {
          title: "ساخت ازمون",
          url: "/admin/exam/add",
        },
      ],
    },
 
    {
      title: "کد تخفیف",
      url: "/admin/pricecode",
      icon: PercentCircle,
      items: [
        // {
        //   title: "تحلیل ها",
        //   url: "#",
        // },

      ],
    },
    
    {
      title: "لیست کاربران",
      url: "/admin/userlist",
      icon: Users2Icon,
      items: [
        // {
        //   title: "تحلیل ها",
        //   url: "#",
        // },

      ],
    },
     {
      title: "پرداخت ها",
      url: "/admin/payments",
      icon: DollarSign,
      items: [
        // {
        //   title: "تحلیل ها",
        //   url: "#",
        // },

      ],
    }
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [

  ],
  projects: [
    

    {
            name: "پشتیبانی",
      url: "tel:+989102942780",
      icon: PhoneCall,

    },

  ],
}

export function AppSidebaradmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
const { data: session } = useSession()

  const dataer = {
    user: {
      name: session?.user?.name || 'مهمان',
      email: session?.user?.phoneNumber || 'بدون شماره',
      avatar: '/avatars/default.jpg', // You can change this if you store avatars
    },
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">مد آزمون</span>
                  <span className="truncate text-xs">مدیریت</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}/>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataer.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
