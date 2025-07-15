import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { ProfileInfoSection } from "@/components/shared/profile-info-section";
import { ProfileInfoItem } from "@/components/shared/profile-info-item";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function ProfilePage() {
    const [personalInfoEdit, setPersonalInfoEdit] = useState<boolean>(false);
    const [liveInEdit, setLiveInEdit] = useState<boolean>(false);
    const [bioEdit, setBioEdit] = useState<boolean>(false);

    // Personal Information
    const handlePersonalInfoEdit = () => {
        setPersonalInfoEdit(true);
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
        setBioEdit(true)
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
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38184074.jpg-M4vCjTSSWVw5RwWvvmrxXBcNVU8MBU.jpeg" alt="profile pic" className="rounded-full w-24 h-24 object-cover border border-gray-300" />
                    <div>
                        <p className="font-semibold text-lg">Vinuth Sri Arampath</p>
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
                        <ProfileInfoItem label="First Name" value={<Input form="personal-info-form" className="w-full" type="text" name="first_name" placeholder="First Name" />} />
                        <ProfileInfoItem label="Last Name" value={<Input form="personal-info-form" className="w-full" type="text" name="last_name" placeholder="Last Name" />} />
                        <ProfileInfoItem label="Email" value={<Input form="personal-info-form" className="w-full" type="email" name="email" placeholder="Email" />} />
                        <ProfileInfoItem label="Phone" value={<Input form="personal-info-form" className="w-full" type="tel" name="phone_number" placeholder="Phone Number" />} />
                        <ProfileInfoItem label="Bio" value={<Textarea form="personal-info-form" className="w-full" name="bio" placeholder="Bio" />} />
                        <div className="col-span-full flex gap-2 mt-2 justify-end">
                            <form id="personal-info-form" className="flex gap-2" onSubmit={handlePersonalInfoSubmit}>
                                <Button variant="outline" type="button" onClick={handlePersonalInfoEditCancel}>Cancel</Button>
                                <Button type="reset" variant="secondary" onClick={() => { }}>Clear</Button>
                                <Button type="submit">Update</Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <ProfileInfoItem label="First Name" value="Vinuth" />
                        <ProfileInfoItem label="Last Name" value="Sri Arampath" />
                        <ProfileInfoItem label="Email" value="vinuthsriarampath@outlook.com" />
                        <ProfileInfoItem label="Phone" value="+94 71 940 1853" />
                        <ProfileInfoItem label="Bio" value="This is my Bio" />
                    </>
                )}
            </ProfileInfoSection>

            {/* Bio */}

            <section className="border border-gray-200/20 rounded-md p-4 mx-1 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">Bio</h2>
                    <Button variant="outline" className="rounded-full cursor-pointer" onClick={handleBioEdit}>
                        <PenLine className="mr-1 h-4 w-4" />Edit
                    </Button>
                </div>
                {bioEdit ? (
                    <>
                        <Textarea name="bio" placeholder="Bio" />
                        <div className="col-span-full flex gap-2 mt-2 justify-end">
                            <form id="personal-info-form" className="flex gap-2" onSubmit={handleBioEditSubmit}>
                                <Button variant="outline" type="button" onClick={handleBioEditCancel}>Cancel</Button>
                                <Button type="reset" variant="secondary" onClick={() => { }}>Clear</Button>
                                <Button type="submit">Update</Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <pre className="text-gray-400 whitespace-pre-wrap text-justify">
                        asodhiu
                        adssa
                        asdsad
                    </pre>
                )}
            </section>

            {/* Live In */}

            <ProfileInfoSection title="Live in" onEdit={!liveInEdit ? handleLiveInEdit : undefined}>
                {liveInEdit ? (
                    <>
                        <ProfileInfoItem label="Address" value={<Textarea name="address" placeholder="Address" />} />
                        <ProfileInfoItem label="Postal Code" value={<Input name="postal_code" placeholder="Postal Code" />} />
                        <div className="col-span-full flex gap-2 mt-2 justify-end">
                            <form id="personal-info-form" className="flex gap-2" onSubmit={handleLiveInEditSubmit}>
                                <Button variant="outline" type="button" onClick={handleLiveInEditCancel}>Cancel</Button>
                                <Button type="reset" variant="secondary" onClick={() => { }}>Clear</Button>
                                <Button type="submit">Update</Button>
                            </form>
                        </div>
                    </>

                ) : (
                    <>
                        <ProfileInfoItem label="Address" value="75/6A, kottikawaththa road, gothatuwa new town,2nd lane, Angoda." />
                        <ProfileInfoItem label="Postal Code" value="10620" />
                    </>
                )
                }
            </ProfileInfoSection>
        </>
    );
}