import ProtectedRoute from "@/components/common/protected-route";
import AccountSettingsPage from "@/features/app/account/account-settings";
import Dashboard from "@/features/app/dashbord/dashboard";
import ProfilePage from "@/features/app/account/profile/profile";
import ProjectPage from "@/features/app/project/project";
import Landing from "@/features/Landing";
import MainLayout from "@/layouts/main-layout";
import NotFound from "@/pages/not-found";
import { useRoutes } from "react-router-dom";
import SecurityPage from "@/features/app/account/security/security-page";

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
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard/> },
        { path: "project", element: <ProjectPage/> },
        { 
          path: "account", 
          element: <AccountSettingsPage/>, 
          children: [
            {index:true, element:<ProfilePage/>},
            {path:"security", element:<SecurityPage/>}
          ]
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
