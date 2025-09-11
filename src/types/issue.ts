import {Assignee} from "@/types/issue-assignee.ts";
import {IssueLabel} from "@/types/issue-label.ts";

export interface Issue {
    id: number,
    title: string,
    body: string,
    html_url: string,
    number: number,
    labels: IssueLabel[],
    assignee: Assignee,
    assignees: Assignee[],
    state: "open" | "closed",
    state_reason: "completed" | "reopened" | "not_planned" | "duplicate",
    created_at: Date,
    updated_at: Date,
}