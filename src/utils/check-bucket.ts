import {supabase} from "@/config/supabaseClient.ts";

export const CheckBucketExists = async (bucketName: string):Promise<boolean> => {
    const { data:buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        if (error.message.includes("The resource was not found")) {
            return false;
        } else {
            throw Error("Error checking bucket existence: " + error.message);
        }
    } else {
        return buckets.some(bucket => bucket.name === bucketName);
    }
}