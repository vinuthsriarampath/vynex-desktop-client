import {Label} from "@radix-ui/react-dropdown-menu";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import {Issue} from "@/types/issue.ts";
import {DataTable} from "@/components/common/data-table.tsx";
import {FeedbackColumns} from "@/components/app/feedback/feeback-columns.tsx";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

export default function Feedback() {
    const [loading, setLoading] = useState<boolean>(false);
    const [issues, setIssues] = useState<Issue[]>([])

    const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT || " ";
    const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL || " ";
    const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || " ";
    const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || " ";

    useEffect(() => {
        fetchVynexIssues();
    }, []);

    async function fetchVynexIssues() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${GITHUB_BASE_URL}/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues?state=all&per_page=100`,
                {
                    headers: {
                        Authorization: `Bearer ${GITHUB_PAT}`,
                        Accept: "application/vnd.github+json"
                    }
                }
            );

            setIssues(
                response.data.map((issue: any) => ({
                    id: issue.id,
                    title: issue.title,
                    body: issue.body,
                    html_url: issue.html_url,
                    number: issue.number,
                    labels: issue.labels.map((label: any) => ({
                        id: label.id,
                        name: label.name,
                        description: label.description,
                        color: label.color,
                    })),
                    assignee: issue.assignee
                        ? {
                            id: issue.assignee.id,
                            login: issue.assignee.login,
                            avatar_url: issue.assignee.avatar_url,
                            html_url: issue.assignee.html_url,
                        }
                        : null,
                    assignees: issue.assignees.map((assignee: any) => ({
                        id: assignee.id,
                        login: assignee.login,
                        avatar_url: assignee.avatar_url,
                        html_url: assignee.html_url,
                    })),
                    state: issue.state,
                    state_reason: issue.state_reason,
                    created_at: issue.created_at,
                    updated_at: issue.updated_at,
                }))
            );

        }catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error);
            } else {
                toast.error(error instanceof Error ? error.message : "Something went wrong!");
            }
        }finally {
            setLoading(false);
        }
    }
    return(
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className={"flex flex-col"}>
                    <Label className="text-xl sm:text-2xl font-bold">Vynex Feedbacks</Label>
                    <Label className="text-xs text-muted-foreground">All the feedbacks, suggestions, bugs reported by the users and watchers.</Label>
                </div>
                <div className="flex sm:flex-row flex-col w-full sm:w-auto gap-4">
                    <Tooltip>
                        <TooltipTrigger>
                            <Link to="create">
                                <Button> New Issue</Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white ">
                            Create a issue from here and this will create the issue in the github
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <DataTable columns={FeedbackColumns()} data={issues} filterColumn={"number"} loading={loading}/>
        </div>
    )
}