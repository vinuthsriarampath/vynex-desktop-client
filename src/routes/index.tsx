import ProtectedRoute from "@/components/common/protected-route";
import Dashboard from "@/features/app/dashbord/dashboard";
import ProfilePage from "@/features/app/account/profile/profile-page";
import ProjectPage from "@/features/app/project/project";
import Landing from "@/features/Landing";
import MainLayout from "@/layouts/main-layout";
import NotFound from "@/pages/not-found";
import {useRoutes} from "react-router-dom";
import SecurityPage from "@/features/app/account/security/security-page";
import AccountLayout from "@/layouts/account-layout";
import SocialAccounts from "@/features/app/social_accounts/socialAccounts.tsx";
import Feedback from "@/features/app/feedback/feedback.tsx";

export default function AppRoutes() {
    return useRoutes([
        {
            path: "/",
            element: <Landing/>
        },
        {
            path: "/app",
            element: (
                <ProtectedRoute>
                    <MainLayout/>
                </ProtectedRoute>
            ),
            children: [
                {index: true, element: <Dashboard/>},
                {path: "project", element: <ProjectPage/>},
                {path: "social-accounts", element: <SocialAccounts/>},
                {path: "feedback",element: <Feedback/>},
                {
                    path: "account",
                    element: <AccountLayout/>,
                    children: [
                        {index: true, element: <ProfilePage/>},
                        {path: "security", element: <SecurityPage/>}
                    ]
                },
            ],
        },
        {
            path: "*",
            element: <NotFound/>,
        },
    ]);
}
