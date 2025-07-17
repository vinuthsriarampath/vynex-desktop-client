export interface Project{
    id?: number
    repo_id: number
    project_name?: string
    repo_name: string
    html_url: string
    description?: string
    language: string
    clone_url: string
    show_case?: boolean
    status: 'in-progress' | 'done'
    createdAt: Date
    updatedAt: Date
}