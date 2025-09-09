import React, {useState} from "react";
import {Social} from "@/types/social.ts";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trash} from "lucide-react";
import axios from "axios";
import {toast} from "sonner";

interface DeleteSocialAccountProps{
    setSocials: React.Dispatch<React.SetStateAction<Social[]>>
    social:Social
}

export default function DeleteSocialAccount({setSocials,social}: Readonly<DeleteSocialAccountProps>){
    const [open,setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
        toast.error("Token is missing");
    }
    const TOKEN = storedToken || "";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        setLoading(true)
        e.preventDefault();
        try {
            const response = await axios.delete(
                `${BASE_URL}/api/social/delete/${social.id}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${TOKEN}`
                    }
                }
            )
            toast.success(response.data.message);
            setSocials(prev => prev.filter(p => p.id !== social.id));
            setLoading(false);
            setOpen(false);
        }catch (error){
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error)
            } else {
                toast.error(error instanceof Error ? error.message : "Something went wrong")
            }
            setLoading(false);
        }
    }

    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer" variant={"ghost"}>
                    <Trash className="text-red-400 hover:text-red-700"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete this social account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <p>This will permanently delete the social link and cannot be restored </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form id="delete-confirmation" onSubmit={handleSubmit}>
                        <Button type={"submit"}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold" disabled={loading}>{loading ? "Loading" : "Delete"}</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}