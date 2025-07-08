import { Button } from "@/components/ui/button";
import { Project } from "@/types/Project";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { useState } from "react";

export default function ProjectPage() {
    const [projects,setProjects] = useState<Project[]>([])

    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL || " ";
    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT || " ";
    const TOKEN =  localStorage.getItem('token');

    async function handleSync() {
        try {
            let page = 1;
            let hasMore = true;
            let allRepos: any[] = [];

            while (hasMore) {
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
            }

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

            setProjects(mappedProjects);

            try{
                const response = await axios.post(
                    `${BASE_URL}/api/project/sync`,
                    JSON.stringify(projects),
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                
                // Handle the new API response structure
                if (response.data && response.data.newRepos) {
                    console.log("Newly created projects:", response.data.newRepos);
                } else if (response.data && response.data.error) {
                    console.error("API Error:", response.data.error);
                } else {
                    console.log("Unexpected response:", response.data);
                }
            }catch(error){
                console.error("vynex server error ", error);
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <Label className="text-xl sm:text-2xl font-bold">Project Management</Label>
                <Button className="w-full sm:w-auto cursor-pointer" onClick={handleSync}>
                    Sync Github
                </Button>
            </div>
        </div>
    );
}
