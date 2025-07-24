import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Project } from "@/types/Project";
import axios, { AxiosResponse } from "axios";
import { CircleQuestionMark, Pencil } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {validateProjectForm} from "@/utils/validate-project-form.ts";

interface UpdateProjectInterface {
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
    project: Project;
}
export default function UpdateProject({ setProjects, project }: Readonly<UpdateProjectInterface>) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [open, setOpen] = useState<boolean>();

    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT ?? " ";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL;
    const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";
    const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME ?? " ";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const project_name = formData.get('project_name') as string;
        const repo_name = formData.get('repo_name') as string;
        const description = formData.get('description') as string;
        const isPrivate = formData.get('isPrivate') === 'on';
        const showCase = formData.get('showCase') === 'on';
        const completed = formData.get('completed') === 'on';

        const { isValid, errors } = validateProjectForm({ project_name, repo_name, description });
        setErrors(errors);
        if (!isValid) return;


        const toastId = toast.loading("Updating the Repository on GitHub");

        try {
            const newRepo:AxiosResponse = await updateGitHubRepo(repo_name, description, isPrivate);
            toast.loading("Repository Updated!, Updating Local Details!", { id: toastId });

            if(!project.id){
                toast.error("Project ID is missing", { id: toastId });
                return;
            }

            const updatedProject = await updateProjectBackend(project.id, project_name, newRepo.data, showCase, completed);
            console.log(updatedProject);
            setProjects(prev => prev
                .map(p => p.id === project.id ? updatedProject.data : p)
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            );

            toast.success("Project created successfully!", { id: toastId });

            setOpen(false);
        } catch (error) {
            handleError(error, toastId);
        }
    };

    const updateGitHubRepo = (repo_name: string, description: string, isPrivate: boolean) => {
        return axios.patch(
            `${GITHUB_BASE_URL}/repos/${GITHUB_USERNAME}/${project.repo_name}`,
            {
                name: repo_name,
                description,
                private: isPrivate,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_PAT}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );
    };

    const updateProjectBackend = ( projectId: number, project_name: string, repo: { id: number; name: string; html_url: string; description: string; language: string; clone_url: string; created_at: string | Date; updated_at: string | Date; }, showCase: boolean, completed: boolean ) => {
        return axios.patch(
            `${BASE_URL}/api/project/update?projectId=${projectId}`,
            {
                project_name,
                show_case: showCase,
                repo_id: repo.id,
                repo_name: repo.name,
                html_url: repo.html_url,
                description: repo.description,
                language: repo.language,
                clone_url: repo.clone_url,
                status: completed ? 'completed' : 'in-progress',
                createdAt: new Date(repo.created_at),
                updatedAt: new Date(repo.updated_at),
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            }
        );
    };

    const handleError = (error: unknown, toastId: string | number) => {
        if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.error ?? error.response?.data?.errors?.[0]?.message;
            toast.error(msg ?? "Something went wrong", { id: toastId });
        } else {
            toast.error(error instanceof Error ? error.message : "Something went wrong", { id: toastId });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer" variant={"ghost"} onClick={()=> {setOpen(true)}}>
                    <Pencil className="text-yellow-400 hover:text-yellow-700"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Project : {project.id} : {project.project_name}</DialogTitle>
                    <DialogDescription>
                        Update an existing project
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="grid grid-cols items-center gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="project_name">
                            Project Name (Show Case Name)
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Provide a readable project name for visualization.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input id="project_name" name="project_name" defaultValue={project.project_name} />
                        {errors.project_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.project_name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repo_name">
                            GitHub Repository Name
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Repository name will create under the name you provide here.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input id="repo_name" name="repo_name" defaultValue={project.repo_name} />
                        {errors.repo_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.repo_name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Provide a brief description about the project.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Textarea id="description" name="description" defaultValue={project.description} />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="isPrivate">Private :-</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    If true, Github repository will be private.
                                </TooltipContent>
                            </Tooltip>
                            <Checkbox id="isPrivate" name="isPrivate" className="cursor-pointer" defaultChecked={false} />
                        </div>
                    </div>
                    <hr />
                    <div className="flex flex-row gap-4">
                        <div className="flex gap-3">
                            <Label htmlFor="showCase">Show Case this Project ? </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    If true, project will open to show case.
                                </TooltipContent>
                            </Tooltip>
                            <Checkbox id="showCase" name="showCase" className="cursor-pointer" defaultChecked={project.show_case} />
                        </div>
                        <div className="flex gap-3">
                            <Label htmlFor="completed">Completed Project ? </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    If true, this project will be marked as a completed project.
                                </TooltipContent>
                            </Tooltip>
                            <Checkbox id="completed" name="completed" className="cursor-pointer" defaultChecked={project.status==='completed'} />
                        </div>
                    </div>
                    <div className="flex justify-end flex-row gap-4">
                        <Button type="reset" variant={"outline"} className="cursor-pointer">Clear</Button>
                        <Button type="submit" className="cursor-pointer">Update</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}