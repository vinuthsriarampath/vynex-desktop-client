import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Tooltip, TooltipContent} from "@/components/ui/tooltip.tsx";
import {TooltipTrigger} from "@radix-ui/react-tooltip";
import {CircleQuestionMark} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import React, {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Platform} from "@/types/enums/platform.ts";
import {toast} from "sonner";
import axios from "axios";
import {Social} from "@/types/social.ts";

interface CreateSocialAccountProps{
    setSocials: React.Dispatch<React.SetStateAction<Social[]>>
}

export default function CreateSocialAccount({setSocials}: Readonly<CreateSocialAccountProps>){
    const [open, setOpen] = useState(false);
    const [ loading,setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const platforms =  Object.values(Platform);

    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const handleFormSubmit= async (e:React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const platform =  formData.get('platform') as string;
        const username =  formData.get('username') as string;
        const url =  formData.get('url') as string;

        if(validateForm(username, url, platform)){
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/social/create`,
                    {
                        platform: platform,
                        username: username,
                        url: url
                    },
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${TOKEN}`,
                        }
                    }
                )
                setLoading(false);
                toast.success(response.data.message);
                setSocials(prevSocials => [...prevSocials, response.data.social]);
                setOpen(false);
            }catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.error)
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong")
                }
                setLoading(false);
            }
        }
    }

    function validateForm(username: string, url: string, platform: string) {
        const newErrors: { [key: string]: string } = {};

        if (!username || username.trim() === '') {
            newErrors.username = "Username is Required"
        }

        if (!url || url.trim() === '') {
            newErrors.url = "url is Required"
        }

        if (!platform || platform.trim() === '') {
            newErrors.platform = "platform is required"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button  className="w-full sm:w-auto cursor-pointer">
                    New Social Account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Social Account</DialogTitle>
                    <DialogDescription>
                        Link your social account to your profile.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="grid grid-cols items-center gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="platform">
                            Platform
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Select the platform.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Select name="platform">
                            <SelectTrigger className="w-xs">
                                <SelectValue placeholder="Select a platform" />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map((platform) => (
                                    <SelectItem key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.platform && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.platform}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">
                            Username
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Provide a readable username for visualization.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input id="username" name="username" />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.username}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url">
                            Url
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Provide the url for your social account.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input id="url" name="url" />
                        {errors.url && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.url}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end flex-row gap-4">
                        <Button type="reset" variant={"outline"} className="cursor-pointer">Clear</Button>
                        <Button type="submit" className="cursor-pointer" disabled={loading}>{loading? "Loading.." : "Submit"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}