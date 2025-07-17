import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/contexts/userContext";
import axios from "axios";
import { PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";



export default function BioSection() {
    const [bioEdit, setBioEdit] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");
    const { user, updateUser } = useUserContext();

    const handleBioEdit = () => {
        setBioEdit(true);
        // handleLiveInEditCancel();
        // handlePersonalInfoEditCancel();
    }

    const handleBioEditCancel = () => {
        setErrors({});
        setBioEdit(false);
    }

    const handleBioEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const bio = formData.get("bio") as string;
        if (validateBio(bio)) {
            const toastId = toast.loading("Updating bio..")
            try {
                const response = await axios.patch(
                    `${BASE_URL}/api/user/update/bio`,
                    { bio },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            Accept: "application/json",
                        }
                    }
                )

                updateUser(response.data)
                toast.success("Bio successfully updated!!", { id: toastId });
                setBioEdit(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.data.details) {
                        toast.error(error.response?.data.details[0].message, { id: toastId });
                    } else {
                        toast.error(error.response?.data.error, { id: toastId });
                    }
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong")
                }
            }
        }
        return;
    }

    const validateBio = (bio: string) => {
        const newErrors: { [key: string]: string } = {};

        if (!bio || bio.trim() === '') {
            newErrors.bio = "Bio is Required"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return (
        <section className="border border-gray-200/20 rounded-md p-4 mx-1 mb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Bio</h2>
                {!bioEdit &&
                    <Button variant="outline" className="rounded-full cursor-pointer" onClick={handleBioEdit}>
                        <PenLine className="mr-1 h-4 w-4" />Edit
                    </Button>
                }
            </div>
            {bioEdit ? (
                <>
                    <Textarea name="bio" form="bio-form" placeholder="Bio" defaultValue={user.bio ? user.bio : "Add Bio here..."} />
                    {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                    <div className="col-span-full flex gap-2 mt-2 justify-end">
                        <form id="bio-form" className="flex gap-2" onSubmit={handleBioEditSubmit}>
                            <Button variant="outline" type="button" className="cursor-pointer" onClick={handleBioEditCancel}>Cancel</Button>
                            <Button type="reset" variant="secondary" className="cursor-pointer">Clear</Button>
                            <Button type="submit" className="cursor-pointer">Update</Button>
                        </form>
                    </div>
                </>
            ) : (
                <pre className="text-gray-400 whitespace-pre-wrap text-justify">
                    {user.bio ? user.bio : "Add Bio here..."}
                </pre>
            )}
        </section>
    )
}