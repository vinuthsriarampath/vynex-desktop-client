import BioSection from "@/components/app/profile/bio-section";
import LiveInSection from "@/components/app/profile/live-in-section";
import PersonalInfoSection from "@/components/app/profile/personal-info-section";
import ProfileHeaderSection from "@/components/app/profile/profile-header-section";


export default function ProfilePage() {
    return (
        <>
            <h1 className="font-bold mb-6 text-2xl">My Profile</h1>
            <ProfileHeaderSection/>

            {/* personal information */}

            <PersonalInfoSection/>

            {/* Bio */}

            <BioSection/>

            {/* Live In */}

            <LiveInSection/>
        </>
    );
}