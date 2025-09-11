import {LayoutDashboard, FolderGit2, Handshake, MessageCircleWarning} from "lucide-react"
import { Link } from "react-router-dom"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "../custom/nav-user"
import { useUserContext } from "@/contexts/userContext"

const items = [
    {
        title: "Dashboard",
        url: "/#/app/",
        icon: LayoutDashboard,
    },
    {
        title: "Projects",
        url: "/#/app/project",
        icon: FolderGit2,
    },
    {
        title: "Social Accounts",
        url: "/#/app/social-accounts",
        icon: Handshake,
    }
]

const bottomItems = [
    {
        title: "Report Feedbacks",
        url: "/#/app/feedback",
        icon: MessageCircleWarning,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUserContext();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link to="/app">
                                <img src="icon.ico" className="!size-5" />
                                <span className="text-base font-semibold">Vynex</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className={"flex flex-col justify-between"}>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="cursor-pointer">
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url.replace('/#', '')}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {bottomItems.map((item) => (
                                <SidebarMenuItem key={item.title} className="cursor-pointer">
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url.replace('/#', '')}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}