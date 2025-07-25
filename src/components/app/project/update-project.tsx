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
import React, {useRef, useState} from "react";
import { toast } from "sonner";
import {validateProjectForm} from "@/utils/validate-project-form.ts";
import {CheckBucketExists} from "@/utils/check-bucket.ts";
import {UploadFile} from "@/utils/upload-file.ts";

interface UpdateProjectInterface {
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
    project: Project;
}
export default function UpdateProject({ setProjects, project }: Readonly<UpdateProjectInterface>) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [open, setOpen] = useState<boolean>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT ?? " ";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL;
    const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";
    const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME ?? " ";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropAreaRef = useRef<HTMLLabelElement | null>(null);
    const imageViewRef = useRef<HTMLDivElement | null>(null);

    const bucket_name = 'project-thumbnails';

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let thumbnail_url:string = '';

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

            if(selectedFile){
                const fileName = generateFileName(selectedFile.name);
                if (await CheckBucketExists(bucket_name)) {
                    thumbnail_url=await UploadFile(bucket_name, project.repo_id.toString(), fileName, selectedFile);
                }else {
                    toast.error('Bucket does not exist!');
                }
            }

            const updatedProject = await updateProjectBackend(project.id, project_name, newRepo.data, showCase, completed,thumbnail_url);

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

    const updateProjectBackend = ( projectId: number, project_name: string, repo: { id: number; name: string; html_url: string; description: string; language: string; clone_url: string; created_at: string | Date; updated_at: string | Date; }, showCase: boolean, completed: boolean, thumbnail:string ) => {
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
                thumbnail: thumbnail || project.thumbnail,
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

    const handleThumbnailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]){
            selectImage(e.target.files[0]);
        }
    }

    const selectImage = (file: File)=> {
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);
        setSelectedFile(file);
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if(e.dataTransfer.files?.[0]){
            selectImage(e.dataTransfer.files[0]);
            if (inputRef.current) {
                inputRef.current.files = e.dataTransfer.files;
            }
        }
    }

    const handleDragOver = (e : React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    }

    const generateFileName = (name: string) => {
        return `${project.repo_id}_${Date.now()}.${name.split('.').pop()}`;
    }

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
                    <div className="space-y-2 flex justify-center items-center">
                        <Label id={"image_input"} className="w-85 h-40 cols-span-1 flex items-center border-1 border-gray-600" ref={dropAreaRef} onDrop={handleDrop} onDragOver={handleDragOver}>
                            <Input type={"file"}  id="image_input" name="image_input" accept=".png, .jpg, .jpeg" hidden ref={inputRef} onChange={handleThumbnailInput} />
                            <div id={"image_view"}
                                 ref={imageViewRef}
                                 className="flex flex-col items-center justify-center text-center w-full h-full bg-center bg-cover overflow-hidden aspect-square"
                                 style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : { backgroundImage: `url(${project.thumbnail})` }}
                            >
                                {!selectedFile && !project.thumbnail&&(
                                    <>
                                        <svg id="upload-icon" xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500"
                                             viewBox="0 0 32 32">
                                            <path
                                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                                            <path
                                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                                        </svg>
                                        <p className="text-sm">Drag and Drop or click here to upload an image</p>
                                    </>
                                )}

                            </div>
                        </Label>
                    </div>
                    <hr/>
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