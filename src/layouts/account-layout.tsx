import { Button } from "@/components/ui/button";
import { Trash2, ShieldAlert, User } from "lucide-react";
import { Outlet } from "react-router-dom";

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
    return(
        <div>
            <h3 className="font-bold">Account Settings</h3>
            <div className="border-1 border-gray-200/20 rounded-lg max-h-screen px-2 py-4 grid grid-cols-6">
                <div className="col-span-1 flex flex-col  items-start px-4 gap-18">
                    <div className="flex flex-col w-full gap-4">
                        {items.map((item) => (    
                            <a href={item.url}>
                                <Button className="w-full cursor-pointer"><item.icon />{item.title}</Button>
                            </a>
                        ))}
                    </div>
                    <Button className="w-full bg-red-500 text-white hover:bg-red-700 cursor-pointer"><Trash2/>Delete Profile</Button>
                </div>
                <div className="col-span-5 border-s-2 border-gray-200/20 ps-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}