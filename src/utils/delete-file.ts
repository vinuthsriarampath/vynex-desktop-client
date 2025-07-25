import {supabase} from "@/config/supabaseClient.ts";

export const DeleteFile = async (bucketName: string, folderPath: string): Promise<boolean> => {

    const {data: files, error: listError} = await supabase
        .storage
        .from(bucketName)
        .list(folderPath, {limit: 1000});

    if (listError) {
        console.error("Error listing folder files:", listError.message);
        return false;
    } else {
        const pathsToDelete = [...files.map(file => `${folderPath}/${file.name}`)];

        if (pathsToDelete.length > 0) {
            const {data, error: deleteError} = await supabase
                .storage
                .from(bucketName)
                .remove(pathsToDelete);

            if (deleteError) {
                console.error("Error deleting folder files:", deleteError.message);
                return false
            } else {
                console.log("Folder deleted successfully", data);
                return true
            }
        } else {
            console.log("Folder is already empty");
            return false
        }
    }
}