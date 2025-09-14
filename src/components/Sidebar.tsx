import { Settings, Upload, FileCheck, Shield } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from "react-router";

const navigationItems = [
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "Configure API credentials and preferences",
    },
    {
        title: "Upload",
        url: "/upload",
        icon: Upload,
        description: "Upload documents for signing",
    },
    {
        title: "Status Page",
        url: "/status",
        icon: FileCheck,
        description: "Track document signing status",
    },
]

const AppSidebar = () => {

    return (
        <div className="flex min-h-screen bg-accent">
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-2 py-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">SecureSign</span>
                                <span className="text-xs text-muted-foreground">Aadhaar eSign</span>
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarSeparator className="mx-0"/>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navigationItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild tooltip={item.description} className="w-full">
                                                <Link to={item.url} className="flex items-center gap-3">
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <SidebarTrigger />
            </SidebarProvider>
        </div>
    )
}

export default AppSidebar