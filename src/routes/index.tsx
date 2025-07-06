import ProtectedRoute from "@/components/common/protected-route";
import Dashboard from "@/features/app/dashbord/dashboard";
import Project from "@/features/app/project/project";
import Landing from "@/features/Landing";
import MainLayout from "@/layouts/main-layout";
import NotFound from "@/pages/not-found";
import { useRoutes } from "react-router-dom";

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
        { path: "project", element: <Project/> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
