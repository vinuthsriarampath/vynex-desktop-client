import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Project} from "@/types/Project.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Trash} from "lucide-react";
import {useState} from "react";
import axios from "axios";
import {toast} from "sonner";

interface DeleteProjectProps {
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    project: Project;
}

export default function DeleteProject({setProjects, project}: Readonly<DeleteProjectProps>) {
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT ?? " ";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL;
    const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000";
    const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME ?? " ";
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const toastId = toast.loading("Deleting project..");
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const repoName = formData.get("repo_name") as string;

        if (repoName.trim() === "" || repoName !== project.repo_name) {
            const newErrors: { [key: string]: string } = {};
            newErrors.repo_name = `Please type "${project.repo_name}" to confirm deletion.`;
            setErrors(newErrors);
        } else {
            setErrors({});
            try {
                await axios.delete(
                    `${GITHUB_BASE_URL}/repos/${GITHUB_USERNAME}/${project.repo_name}`,
                    {
                        headers: {
                            Authorization: `Bearer ${GITHUB_PAT}`,
                            Accept: "application/vnd.github+json",
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    }
                )
                toast.loading("Repository deleted successfully!, deleting from local..", { id: toastId });

                await  axios.delete(
                    `${BASE_URL}/api/project/delete/${project.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            Accept: "application/json",
                        },
                    }
                )

                toast.success("Project deleted successfully!", { id: toastId });
                setProjects(prev => prev.filter(p => p.id !== project.id));
                setOpen(false);
            }catch (error){
                if (axios.isAxiosError(error)) {
                    const msg = error.response?.data?.error ?? error.response?.data?.errors?.[0]?.message;
                    toast.error(msg ?? "Something went wrong", { id: toastId });
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong", { id: toastId });
                }
            }

        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer" variant={"ghost"}>
                    <Trash className="text-red-400 hover:text-red-700"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete project
                        :- {project.id}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <p>This will permanently delete the {GITHUB_USERNAME}/{project.repo_name} repository, wiki,
                            issues, comments, packages, secrets, workflow runs, and remove all collaborator
                            associations.</p>
                        <Label htmlFor={"repo_name"} className="mb-2">To confirm, type <span
                            className={"font-bold"}>"{project.repo_name}"</span> in the box below </Label>
                        <Input type={"text"} name={"repo_name"} id={"repo_name"} form={"delete-confirmation"}
                               className="ring-1 ring-red-500 focus:ring-red-500 "/>
                        {errors.repo_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.repo_name}
                            </p>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form id="delete-confirmation" onSubmit={handleSubmit}>
                        <Button type={"submit"}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold">Delete</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}