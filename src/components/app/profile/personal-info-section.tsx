import { AccountInfoItem } from "@/components/shared/account-info-item";
import { AccountInfoSection } from "@/components/shared/account-info-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/contexts/userContext";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";


export default function PersonalInfoSection() {
    const [personalInfoEdit, setPersonalInfoEdit] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");
    const { user, updateUser } = useUserContext();

    const handlePersonalInfoEdit = () => {
        setPersonalInfoEdit(true);
        // handleBioEditCancel();
        // handleLiveInEditCancel();
    }

    const handlePersonalInfoEditCancel = () => {
        setErrors({});
        setPersonalInfoEdit(false);
    }

    const handlePersonalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const first_name = formData.get("first_name") as string;
        const last_name = formData.get("last_name") as string;
        const contact = formData.get("contact") as string;

        if (validatePersonalInfo(first_name, last_name, contact)) {
            const toastId = toast.loading("Updating personal information")
            try {
                const response = await axios.patch(
                    `${BASE_URL}/api/user/update/personal-info`,
                    { first_name, last_name, contact },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            Accept: "application/json",
                        }
                    }
                )
                console.log(response);
                updateUser(response.data)
                toast.success("Personal Information successfully updated!!", { id: toastId });
                setPersonalInfoEdit(false);
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

    const validatePersonalInfo = (first_name: string, last_name: string, contact: string) => {
        const newErrors: { [key: string]: string } = {};

        if (!first_name || first_name.trim() === '') {
            newErrors.first_name = "First name is Required"
        }

        if (!last_name || last_name.trim() === '') {
            newErrors.last_name = "Last name is Required"
        }

        if (!contact || contact.trim() === '') {
            newErrors.contact = "Contact is Required"
        } else if (!/^[0-9]{10}$/.test(contact)) {
            newErrors.contact = "Contact should be 10 digits"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return (
        <AccountInfoSection title="Personal Information" onEdit={!personalInfoEdit ? handlePersonalInfoEdit : undefined}>


            {personalInfoEdit ? (
                <>
                    <AccountInfoItem label="First Name" error={errors.first_name && (errors.first_name)} value={<Input form="personal-info-form" defaultValue={user.first_name} className="w-full" type="text" name="first_name" placeholder="First Name" />} />
                    <AccountInfoItem label="Last Name" error={errors.last_name && (errors.last_name)} value={<Input form="personal-info-form" defaultValue={user.last_name} className="w-full" type="text" name="last_name" placeholder="Last Name" />} />
                    <AccountInfoItem label="Email" value={user.email} />
                    <AccountInfoItem label="Phone" error={errors.contact && (errors.contact)} value={<Input form="personal-info-form" defaultValue={user.contact} className="w-full" type="tel" name="contact" placeholder="Phone Number" />} />
                    <div className="col-span-full flex gap-2 mt-2 justify-end">
                        <form id="personal-info-form" className="flex gap-2" onSubmit={handlePersonalInfoSubmit}>
                            <Button variant="outline" type="button" className="cursor-pointer" onClick={handlePersonalInfoEditCancel}>Cancel</Button>
                            <Button type="reset" variant="secondary" className="cursor-pointer">Clear</Button>
                            <Button type="submit" className="cursor-pointer">Update</Button>
                        </form>
                    </div>
                </>
            ) : (
                <>
                    <AccountInfoItem label="First Name" value={user.first_name} />
                    <AccountInfoItem label="Last Name" value={user.last_name} />
                    <AccountInfoItem label="Email" value={user.email} />
                    <AccountInfoItem label="Phone" value={user.contact} />
                </>
            )}
        </AccountInfoSection>
    )
}