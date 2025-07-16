import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { ProfileInfoSection } from "@/components/shared/profile-info-section";
import { ProfileInfoItem } from "@/components/shared/profile-info-item";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/contexts/userContext";


export default function ProfilePage() {
    const [personalInfoEdit, setPersonalInfoEdit] = useState<boolean>(false);
    const [liveInEdit, setLiveInEdit] = useState<boolean>(false);
    const [bioEdit, setBioEdit] = useState<boolean>(false);

    const { user } = useUserContext();

    // Personal Information
    const handlePersonalInfoEdit = () => {
        setPersonalInfoEdit(true);
        handleBioEditCancel();
        handleLiveInEditCancel();
    }

    const handlePersonalInfoEditCancel = () => {
        setPersonalInfoEdit(false);
    }

    const handlePersonalInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPersonalInfoEdit(false);
        const formData = new FormData(e.currentTarget);
        const first_name = formData.get("first_name");
        console.log(first_name);
    }

    // Live On
    const handleLiveInEdit = () => {
        setLiveInEdit(true)
        handleBioEditCancel();
        handlePersonalInfoEditCancel();
    }

    const handleLiveInEditCancel = () => {
        setLiveInEdit(false);
    }

    const handleLiveInEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLiveInEdit(false);
        const formData = new FormData(e.currentTarget);
        const address = formData.get("address");
        console.log(address);
    }

    // Bio 
    const handleBioEdit = () => {
        setBioEdit(true);
        handleLiveInEditCancel();
        handlePersonalInfoEditCancel();
    }

    const handleBioEditCancel = () => {
        setBioEdit(false);
    }

    const handleBioEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLiveInEdit(false);
        const formData = new FormData(e.currentTarget);
        const bio = formData.get("bio");
        console.log(bio);
    }

    return (
        <>
            <h1 className="font-bold mb-6 text-2xl">My Profile</h1>
            <div className="border border-gray-200/20 rounded-md p-4 mx-1 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38184074.jpg-M4vCjTSSWVw5RwWvvmrxXBcNVU8MBU.jpeg" alt="profile pic" className="rounded-full w-24 h-24 object-cover" />
                    <div>
                        <p className="font-semibold text-lg">{user.first_name } {user.last_name}</p>
                        <p className="text-gray-400">Trainee Software Developer</p>
                        <p className="text-gray-500">@Siygen (Private) Limited</p>
                    </div>
                </div>
                <Button variant="outline" className="rounded-full cursor-pointer flex items-center gap-2"><PenLine className="h-4 w-4" />Edit</Button>
            </div>

            {/* personal information */}

            <ProfileInfoSection title="Personal Information" onEdit={!personalInfoEdit ? handlePersonalInfoEdit : undefined}>


                {personalInfoEdit ? (
                    <>
                        <ProfileInfoItem label="First Name" value={<Input form="personal-info-form" value={user.first_name} className="w-full" type="text" name="first_name" placeholder="First Name" />} />
                        <ProfileInfoItem label="Last Name" value={<Input form="personal-info-form" value={user.last_name} className="w-full" type="text" name="last_name" placeholder="Last Name" />} />
                        <ProfileInfoItem label="Email" value={<Input form="personal-info-form" value={user.email} className="w-full" type="email" name="email" placeholder="Email" />} />
                        <ProfileInfoItem label="Phone" value={<Input form="personal-info-form" value={user.contact} className="w-full" type="tel" name="phone_number" placeholder="Phone Number" />} />
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
                        <ProfileInfoItem label="First Name" value={user.first_name} />
                        <ProfileInfoItem label="Last Name" value={user.last_name} />
                        <ProfileInfoItem label="Email" value={user.email} />
                        <ProfileInfoItem label="Phone" value={user.contact} />
                    </>
                )}
            </ProfileInfoSection>

            {/* Bio */}

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
                        <Textarea name="bio" placeholder="Bio" value={user.bio ? user.bio : "Add Bio here..."} />
                        <div className="col-span-full flex gap-2 mt-2 justify-end">
                            <form id="personal-info-form" className="flex gap-2" onSubmit={handleBioEditSubmit}>
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

            {/* Live In */}

            <ProfileInfoSection title="Live in" onEdit={!liveInEdit ? handleLiveInEdit : undefined}>
                {liveInEdit ? (
                    <>
                        <ProfileInfoItem label="Address" value={<Textarea name="address" placeholder="Address" value={user.address} />} />
                        <ProfileInfoItem label="Postal Code" value={<Input name="postal_code" placeholder="Postal Code" value={user.postal_code} />} />
                        <div className="col-span-full flex gap-2 mt-2 justify-end">
                            <form id="personal-info-form" className="flex gap-2" onSubmit={handleLiveInEditSubmit}>
                                <Button variant="outline" type="button" className="cursor-pointer" onClick={handleLiveInEditCancel}>Cancel</Button>
                                <Button type="reset" variant="secondary" className="cursor-pointer">Clear</Button>
                                <Button type="submit" className="cursor-pointer">Update</Button>
                            </form>
                        </div>
                    </>

                ) : (
                    <>
                        <ProfileInfoItem label="Address" value={user.address} />
                        <ProfileInfoItem label="Postal Code" value={user.postal_code} />
                    </>
                )
                }
            </ProfileInfoSection>
        </>
    );
}