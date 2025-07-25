import {supabase} from "@/config/supabaseClient.ts";
import {toast} from "sonner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const UploadFile = async (bucketName: string, folderName:string, fileName:string, file:File): Promise<string> => {
    const {data, error} = await supabase
        .storage
        .from(bucketName)
        .upload(`${folderName}/${fileName}`,
            file,
            {
                cacheControl: "3600",
                upsert: true,

            }
        );

    if (error) {
        toast.error("File Upload Failed");
        return "";
    } else {
        return SUPABASE_URL + "/storage/v1/object/public/" + data.fullPath
    }
}