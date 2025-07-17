import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Project } from "@/types/Project";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import axios, { AxiosResponse } from "axios";
import { CircleQuestionMark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateProjectsProps {
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export default function CreateProject({ setProjects }: CreateProjectsProps) {

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [open, setOpen] = useState(false);

    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT || " ";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL;
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        const project_name = formData.get('project_name') as string;
        const repo_name = formData.get('repo_name') as string;
        const description = formData.get('description') as string;
        const isPrivate = formData.get('isPrivate') === 'on';
        const autoInit = formData.get('autoInit') === 'on';
        const showCase = formData.get('showCase') === 'on';
        const completed = formData.get('completed') === 'on';

        if (validateForm(project_name, repo_name, description)) {

            const toastId = toast.loading("Creating the Repository on GitHub")

            try {
                const newRepo = await axios.post(
                    `${GITHUB_BASE_URL}/user/repos`,
                    {
                        "name": repo_name,
                        "description": description,
                        "private": isPrivate,
                        "auto_init": autoInit
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${GITHUB_PAT}`,
                            Accept: "application/vnd.github+json",
                            "X-GitHub-Api-Version": "2022-11-28"
                        }
                    }

                )

                toast.loading("Repository Created !", { id: toastId });

                try {
                    const newProject: AxiosResponse = await axios.post(
                        `${BASE_URL}/api/project/create`,
                        {
                            project_name: project_name,
                            show_case: showCase,
                            repo_id: newRepo.data.id,
                            repo_name: newRepo.data.name,
                            html_url: newRepo.data.html_url,
                            description: newRepo.data.description,
                            language: newRepo.data.language,
                            clone_url: newRepo.data.clone_url,
                            status: completed ? 'completed' : 'in-progress',
                            createdAt: new Date(newRepo.data.created_at),
                            updatedAt: new Date(newRepo.data.updated_at),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${TOKEN}`,
                                Accept: "application/json",
                            }
                        }

                    )
                    setProjects(prevProjects => [...prevProjects, newProject.data.project])
                    toast.success("Project created successfully !", { id: toastId });
                    setOpen(false);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data.error, { id: toastId })
                    } else {
                        toast.error(error instanceof Error ? error.message : "Something went wrong")
                    }
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.errors[0].message, { id: toastId })
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong")
                }
            }
        }
    }

    function validateForm(project_name: string, repo_name: string, description: string) {
        const newErrors: { [key: string]: string } = {};

        if (!project_name || project_name.trim() === '') {
            newErrors.project_name = "Project name is Required"
        }

        if (!repo_name || repo_name.trim() === '') {
            newErrors.repo_name = "Repository name is Required"
        } else if (!/^[a-zA-Z0-9._-]+$/.test(repo_name)) {
            newErrors.repo_name = "The repository name can only contain ASCII letters, digits, and the characters ., -, and _."
        }

        if (!description || description.trim() === '') {
            newErrors.description = "Description is required"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="w-full sm:w-auto cursor-pointer">
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                    <DialogDescription>
                        Create a new Project
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
                        <Input id="project_name" name="project_name" />
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
                        <Input id="repo_name" name="repo_name" />
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
                        <Textarea id="description" name="description" />
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
                            <Checkbox id="isPrivate" name="isPrivate" className="cursor-pointer" />
                        </div>
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="autoInit">Auto Init :-</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18} />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    If true, Github repository will automatically initialized with a readme file.
                                </TooltipContent>
                            </Tooltip>
                            <Checkbox id="autoInit" name="autoInit" className="cursor-pointer" />
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
                            <Checkbox id="showCase" name="showCase" className="cursor-pointer" />
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
                            <Checkbox id="completed" name="completed" className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex justify-end flex-row gap-4">
                        <Button type="reset" variant={"outline"} className="cursor-pointer">Clear</Button>
                        <Button type="submit" className="cursor-pointer">Submit</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}