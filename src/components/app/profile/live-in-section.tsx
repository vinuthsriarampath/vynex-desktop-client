import { AccountInfoItem } from "@/components/shared/account-info-item";
import { AccountInfoSection } from "@/components/shared/account-info-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/contexts/userContext";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";


export default function LiveInSection() {

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [liveInEdit, setLiveInEdit] = useState<boolean>(false);


    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const { user, updateUser } = useUserContext();

    const handleLiveInEdit = () => {
        setLiveInEdit(true)
        // handleBioEditCancel();
        // handlePersonalInfoEditCancel();
    }

    const handleLiveInEditCancel = () => {
        setErrors({});
        setLiveInEdit(false);
    }

    const handleLiveInEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("In the Submit")

        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const address = formData.get("address") as string;
        const postal_code = parseInt(formData.get("postal_code") as string);

        if (validateLiveIn(address, postal_code)) {

            const toastId = toast.loading("Updating Live In information")

            try {
                const response = await axios.patch(
                    `${BASE_URL}/api/user/update/live-in`,
                    { address, postal_code },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            Accept: "application/json",
                        }
                    }
                )
                updateUser(response.data)
                toast.success("Live In successfully updated!!", { id: toastId });
                setLiveInEdit(false);
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

    const validateLiveIn = (address: string, postal_code: number) => {
        const newErrors: { [key: string]: string } = {};
        if (!address || address.trim() === '') {
            newErrors.address = "Address is required";
        }
        if (!postal_code) {
            newErrors.postal_code = "Postal code is required";
        } else if (typeof postal_code !== 'number') {
            newErrors.postal_code = "Postal Code should be a number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    return (
        <AccountInfoSection title="Live in" onEdit={!liveInEdit ? handleLiveInEdit : undefined}>
            {liveInEdit ? (
                <>
                    <AccountInfoItem label="Address" error={errors.address && (errors.address)} value={<Textarea form="live-in-form" name="address" placeholder="Address" defaultValue={user.address} />} />
                    <AccountInfoItem label="Postal Code" error={errors.postal_code && (errors.postal_code)} value={<Input form="live-in-form" name="postal_code" placeholder="Postal Code" defaultValue={user.postal_code} />} />
                    <div className="col-span-full flex gap-2 mt-2 justify-end">
                        <form id="live-in-form" className="flex gap-2" onSubmit={handleLiveInEditSubmit}>
                            <Button variant="outline" type="button" className="cursor-pointer" onClick={handleLiveInEditCancel}>Cancel</Button>
                            <Button type="reset" variant="secondary" className="cursor-pointer">Clear</Button>
                            <Button type="submit" className="cursor-pointer">Update</Button>
                        </form>
                    </div>
                </>

            ) : (
                <>
                    <AccountInfoItem label="Address" value={user.address} />
                    <AccountInfoItem label="Postal Code" value={user.postal_code} />
                </>
            )
            }
        </AccountInfoSection>
    )
}