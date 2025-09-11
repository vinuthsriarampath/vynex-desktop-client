import {ColumnDef} from "@tanstack/react-table";
import {Issue} from "@/types/issue.ts";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, CircleCheck, CircleX} from "lucide-react";
import {Assignee} from "@/types/issue-assignee.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Badge} from "@/components/ui/badge.tsx";

export const FeedbackColumns = (): ColumnDef<Issue>[] => [
    {
        accessorKey: "id",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Id
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    {
        accessorKey: "number",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Issue Number
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    {
        accessorKey: "title",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    {
        accessorKey: "state",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            if (row.getValue("state") === "open") {
                return (
                    <Badge  className={"bg-green-500 text-white"}><CircleCheck className={"text-black"}/>Open</Badge>
                )
            }else{
                return (
                    <Badge  className={"bg-purple-500 text-white"}><CircleX className={"text-black"}/>Closed</Badge>
                )
            }
        }
    },
    {
        accessorKey: "assignee",
        header: ({column}) => {
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Assignee
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => {
            const assignee: Assignee = row.getValue("assignee");
            return (
                <div className={"flex justify-center items-center"}>
                    {assignee ? (
                        <>
                        <Avatar className={"cursor-pointer"} id={"assignee"} onClick={() => {
                            if (window.ipcRenderer) {
                                window.ipcRenderer.send('open-link', assignee.html_url);
                            }
                        }}>
                            <AvatarImage src={assignee.avatar_url} alt={assignee.login}/>
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar><Label onClick={() => {
                            if (window.ipcRenderer) {
                                window.ipcRenderer.send('open-link', assignee.html_url);
                            }
                        }} className={"cursor-pointer"}>•{assignee.login}</Label>
                        </>
                    ) : "-"}
                </div>
            );
        }
    },
]