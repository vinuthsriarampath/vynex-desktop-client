import { Button } from "@/components/ui/button";
import { Trash2, ShieldAlert, User } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const items = [
    {
        title: "My Profile",
        url: "/#/app/account",
        icon: User,
    },
    {
        title: "Security",
        url: "/#/app/account/security",
        icon: ShieldAlert,
    },
]

export default function AccountLayout(){
    const isMobile = useIsMobile();
    const location = useLocation();
    return(
        <div className="flex flex-col gap-3">
            <h3 className="font-bold">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 border-1 border-gray-200/20 rounded-lg max-h-screen px-2 py-4 md:px-2 md:py-4">
                {!isMobile && (
                    <div className="col-span-full md:col-span-1 flex flex-col items-start px-0 md:px-4 gap-4 md:gap-18 mb-4 md:mb-0">
                        <div className="flex flex-col w-full gap-4">
                            {items.map((item) => (    
                                <a href={item.url} key={item.url} className="w-full">
                                    <Button className="w-full cursor-pointer"><item.icon /><span className="lg:block md:hidden">{item.title}</span></Button>
                            </a>
                        ))}
                    </div>
                    <Button className="w-full bg-red-500 text-white hover:bg-red-700 cursor-pointer"><Trash2/><span className="lg:block md:hidden">Delete Profile</span></Button>
                </div>)}
                <div className="col-span-full md:col-span-5 border-s-0 md:border-s-2 border-gray-200/20 ps-0 md:ps-4">
                    <Outlet/>
                </div>
            </div>
            {/* Bottom navigation bar for mobile only */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-background border-t border-gray-200/20 shadow z-50 flex justify-around items-center h-14 md:hidden">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.hash === item.url;
                        return (
                            <a href={item.url} key={item.url} className="flex-1 flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                                    aria-label={item.title}
                                >
                                    <Icon className="size-6" />
                                </Button>
                            </a>
                        );
                    })}
                </nav>
            )}
        </div>
    )
}