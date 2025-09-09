import {Label} from "@radix-ui/react-dropdown-menu";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import {Social} from "@/types/social.ts";
import {DataTable} from "@/components/common/data-table.tsx";
import {SocialAccountsColumns} from "@/components/app/social-accounts/social-accounts-columns.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import CreateSocialAccount from "@/components/app/social-accounts/create-social-account.tsx";

export default function SocialAccounts() {

    const [socials,setSocials] = useState<Social[]>([]);

    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");


    useEffect(() => {
        fetchSocialAccounts();
    },[]);

    const fetchSocialAccounts = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/social/read/all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${TOKEN}`
                    }
                })
            setSocials(response.data.socials);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error);
            } else {
                toast.error(error instanceof Error ? error.message : "Something went wrong!");
            }
        }
    }
    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <Label className="text-xl sm:text-2xl font-bold">Social Accounts Management</Label>
                <Tooltip>
                    <TooltipTrigger>
                        <CreateSocialAccount  setSocials={setSocials}/>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white ">
                        Link your social accounts here
                    </TooltipContent>
                </Tooltip>
            </div>
            <DataTable columns={SocialAccountsColumns({setSocials})} data={socials} filterColumn={"username"}/>
        </div>
    )
}