import {Label} from "@radix-ui/react-dropdown-menu";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {Tooltip, TooltipContent} from "@/components/ui/tooltip.tsx";
import {TooltipTrigger} from "@radix-ui/react-tooltip";
import {CircleQuestionMark, Settings} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useEffect, useState} from "react";
import {IssueLabel} from "@/types/issue-label.ts";
import axios from "axios";
import {toast} from "sonner";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export default function CreateIssue() {

    const [labelPopOpen, setLabelPopOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [labels, setLabels] = useState<IssueLabel[]>()
    const [issueLabels, setIssueLabels] = useState<IssueLabel[]>([]);

    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT || " ";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL || " ";
    const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || " ";
    const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || " ";

    useEffect(() => {
        fetchLabels();
    }, []);

    async function fetchLabels() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${GITHUB_BASE_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/labels`,
                {
                    headers: {
                        Authorization: `Bearer ${GITHUB_PAT}`,
                        Accept: "application/vnd.github+json"
                    }
                }
            )
            setLabels(response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error);
            } else {
                toast.error(error instanceof Error ? error.message : "Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log("Test");
        e.preventDefault();
        const form = e.currentTarget;
        setLoading(true);

        const formData = new FormData(form);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (validateForm(title, description)) {
            const labels = issueLabels.map((lbl) => lbl.name);
            axios.post(
                `${GITHUB_BASE_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`,
                {
                    title,
                    body: description,
                    assignees:[`${GITHUB_USERNAME}`],
                    labels
                },
                {
                    headers: {
                        Authorization: `Bearer ${GITHUB_PAT}`,
                        Accept: "application/vnd.github+json"
                    }
                }
            ).then(() => {
                toast.success("Issue created successfully!");
                form.reset();
                setLabelPopOpen(false);
                setIssueLabels([]);
                resetForm();
            }).catch((error) => {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data.error);
                } else {
                    console.error(error);
                    toast.error(error instanceof Error ? error.message : "Something went wrong!");
                }
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }

    function validateForm(title: string, description: string) {
        const newErrors: { [key: string]: string } = {};

        if (!title || title.trim() === '') {
            newErrors.title = "Title is Required"
        }
        if (!description || description.trim() === '') {
            newErrors.description = "Description is Required"
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function resetForm() {
        setIssueLabels([]);
        setErrors({});
    }

    return (
        <div className={"p-4 sm:p-6"}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-3">
                <div className={"flex flex-col"}>
                    <Label className="text-xl sm:text-2xl font-bold">Create Issue</Label>
                    <Label className="text-xs text-muted-foreground">Create a new issue by briefly explaining the bug or
                        feature request.</Label>
                </div>
                <div className="flex sm:flex-row flex-col w-full sm:w-auto gap-4">
                    <Link to={"/app/feedback"}>
                        <Button variant={"outline"}>Back</Button>
                    </Link>
                </div>
            </div>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-9 space-y-4 p-3 border-e-1 border-foreground/10">
                    <div className="space-y-2">
                        <Label className={"flex flex-row items-center gap-2"}>
                            Title
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18}/>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Provide a readable title for the issue.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input id="title" name="title"/>
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className={"flex flex-row items-center gap-2"}>
                            Description
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleQuestionMark strokeWidth={2} size={18}/>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white ">
                                    Provide a brief description about the issue. Include any relevant details, steps to reproduce, and expected behavior.
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Textarea id="description" name="description" className={"h-80"}/>
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div className={"hidden sm:block"}>
                        <div className="flex justify-end flex-row gap-4 ">
                            <Button type="reset" variant={"outline"} className="cursor-pointer" onClick={resetForm}>Clear</Button>
                            <Button type="submit" className="cursor-pointer" disabled={loading}>{loading ? "Loading..":"Create issue"}</Button>
                        </div>
                    </div>
                </div>
                {/*<Separator orientation={"vertical"} className={"hidden sm:block"}/>*/}
                <div className="col-span-12 sm:col-span-3 gap-2">
                    <div>
                        <Separator className={"my-2"}/>
                        <Popover open={labelPopOpen} onOpenChange={setLabelPopOpen}>
                            <PopoverTrigger>
                                <Button type={"button"} variant="ghost" aria-expanded={labelPopOpen}
                                        className="w-[380px] justify-between">
                                    <p>Labels</p>
                                    <Settings/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[380px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search labels..."/>
                                    <CommandList>
                                        <CommandEmpty>No Labels Found</CommandEmpty>
                                        <CommandGroup>
                                            {labels?.map((label) => (
                                                <CommandItem
                                                    key={label.name}
                                                    value={label.name}
                                                    onSelect={() => {
                                                        setIssueLabels((prev) => {
                                                            if (prev.find((l) => l.name === label.name)) {
                                                                return prev.filter((l) => l.name !== label.name);
                                                            }
                                                            return [...prev, label];
                                                        });
                                                    }}
                                                    className="cursor-pointer rounded-md mb-1 pl-2 relative"
                                                >
                                                    {/* Left bar */}
                                                    {issueLabels.some((lbl) => lbl.name === label.name) && (
                                                        <div
                                                            className="absolute left-0 top-2 bottom-2 w-1.5 bg-blue-500 rounded-r-md"></div>
                                                    )}

                                                    <div className="flex flex-row gap-4 items-center pl-2">
                                                        <Checkbox
                                                            id={label.name}
                                                            checked={issueLabels.some((lbl) => lbl.name === label.name)}
                                                            className="text-black"
                                                        />
                                                        <Label>
                                                            <div className="flex flex-col gap-2">
                                                                <p>{label.name}</p>
                                                                <p className="text-xs text-foreground">{label.description}</p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                </CommandItem>

                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 w-[380px]">
                        {issueLabels.length === 0 ? (
                            <span className="text-muted-foreground text-sm pl-2">No Labels</span>
                        ) : (
                            issueLabels.map((lbl) => (
                                <span key={lbl.name} style={{backgroundColor: `#${lbl.color}`}} className="px-2 py-1 rounded-md text-sm text-black font-medium">
                                    {lbl.name}
                                </span>
                            ))
                        )}
                    </div>
                    <Separator className={"my-2"}/>
                </div>
                <div className={"block sm:hidden"}>
                    <div className="flex justify-end flex-row gap-4 ">
                        <Button type="reset" variant={"outline"} className="cursor-pointer">Clear</Button>
                        <Button type="submit" className="cursor-pointer" disabled={loading}>{loading ? "Loading..":"Create issue"}</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}