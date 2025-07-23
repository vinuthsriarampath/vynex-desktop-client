export interface ProjectFormFields {
    project_name: string;
    repo_name: string;
    description: string;
}

export function validateProjectForm({ project_name, repo_name, description, }: ProjectFormFields): { isValid: boolean; errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};

    if (!project_name?.trim()) {
        errors.project_name = "Project name is required";
    }

    if (!repo_name?.trim()) {
        errors.repo_name = "Repository name is required";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(repo_name)) {
        errors.repo_name =
            "The repository name can only contain ASCII letters, digits, and the characters ., -, and _.";
    }

    if (!description?.trim()) {
        errors.description = "Description is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
