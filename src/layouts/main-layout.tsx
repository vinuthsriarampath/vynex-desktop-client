import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
    const location = useLocation();

    // Function to generate breadcrumb items based on current path
    const generateBreadcrumbItems = () => {
        const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
        const breadcrumbItems = [];

        // Always show "App" as the root
        breadcrumbItems.push({
            label: "App",
            href: "/#/app",
            isCurrent: pathSegments.length === 1 && pathSegments[0] === "app"
        });

        // Add other segments
        for (let i = 1; i < pathSegments.length; i++) {
            const segment = pathSegments[i];
            const isLast = i === pathSegments.length - 1;
            
            // Convert segment to readable label
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);
            const href = `/#/${pathSegments.slice(0, i + 1).join('/')}`;
            
            breadcrumbItems.push({
                label,
                href,
                isCurrent: isLast
            });
        }

        return breadcrumbItems;
    };

    const breadcrumbItems = generateBreadcrumbItems();

    return (
        <div className="h-screen">
            <SidebarProvider style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
                <AppSidebar variant="floating" />
                <main className="w-full">
                    <SidebarInset className="w-full">
                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 data-[orientation=vertical]:h-4"
                                />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {breadcrumbItems.map((item, index) => (
                                            <div key={item.href} className="flex items-center">
                                                <BreadcrumbItem className="hidden md:block">
                                                    {item.isCurrent ? (
                                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink href={item.href}>
                                                            {item.label}
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                                {index < breadcrumbItems.length - 1 && (
                                                    <BreadcrumbSeparator className="hidden md:block" />
                                                )}
                                            </div>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>
                        <div className="px-4">
                            <Outlet />
                        </div>
                    </SidebarInset>
                </main>
            </SidebarProvider>
        </div>
    );
}