import CreateProject from "@/components/app/project/create-project";
import { ProjectColumns } from "@/components/app/project/project-columns";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Project } from "@/types/Project";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);


    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL || " ";
    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT || " ";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    useEffect(() => {
        fetchProjects();
    }, [])

    const fetchProjects = async () => {
        try {
            const response: AxiosResponse<Project[]> = await axios.get(
                `${BASE_URL}/api/project/read/all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${TOKEN}`
                    }
                }
            )
            setProjects(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error);
            } else {
                toast.error(error instanceof Error ? error.message : "Something went wrong!");
            }
        }
    }


    async function handleSync() {
        const toastId = toast.loading("Fetching repositories from GitHub...");
        try {



            let page = 1;
            let hasMore = true;
            let allRepos: any[] = [];

            while (hasMore) {
                try {
                    const response = await axios.get(
                        `${GITHUB_BASE_URL}/user/repos?affiliation=owner&per_page=100&page=${page}`,
                        {
                            headers: {
                                Authorization: `Bearer ${GITHUB_PAT}`,
                                Accept: "application/vnd.github+json",
                            },
                        }
                    );

                    const repos = response.data;
                    allRepos = allRepos.concat(repos);

                    hasMore = repos.length === 100;
                    page++;
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data.error, { id: toastId });
                    } else {
                        toast.error(error instanceof Error ? error.message : "Something went wrong when fetching from github!", { id: toastId });
                    }
                }
            }

            toast.loading("Syncing to database!", { id: toastId });

            const mappedProjects: Project[] = allRepos.map((repo) => ({
                repo_id: repo.id,
                repo_name: repo.name,
                html_url: repo.html_url,
                description: repo.description,
                language: repo.language,
                clone_url: repo.clone_url,
                status: 'in-progress',
                createdAt: new Date(repo.created_at),
                updatedAt: new Date(repo.updated_at),
                project_name: repo.name,
            }));

            const newProjects = mappedProjects.filter((mappedProject) =>
                !projects.some((existingProject) => existingProject.repo_id === mappedProject.repo_id)
            );


            try {
                const response = await axios.post(
                    `${BASE_URL}/api/project/sync`,
                    JSON.stringify(newProjects),
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setProjects(prev => [...prev, ...response.data.newRepos])
                toast.success("Sync Successful !", { id: toastId })
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.error, { id: toastId });
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong wen syncing!", { id: toastId });
                }
            }

        } catch (error) {
            toast.error("Something went wrong!", { id: toastId });
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <Label className="text-xl sm:text-2xl font-bold">Project Management</Label>
                <div className="flex sm:flex-row flex-col w-full sm:w-auto gap-4">
                    {/* <Button variant={"outline"} className="w-full sm:w-auto cursor-pointer">
                        New Project
                    </Button> */}
                    <Tooltip>
                    <TooltipTrigger>
    <CreateProject setProjects={setProjects} />
                        
                    </TooltipTrigger>
                    <TooltipContent className="bg-white ">
                        Create a project from here and this will create a github repository 
                    </TooltipContent>
                </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button className="w-full sm:w-auto cursor-pointer" onClick={handleSync}>
                                Sync Github
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white ">
                            Sync all the repositories in github to the application
                        </TooltipContent>
                    </Tooltip>

                </div>
            </div>
            <DataTable columns={ProjectColumns({setProjects})} data={projects} />
        </div>
    );
}
