import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/config/supabaseClient";
import { useUserContext } from "@/contexts/userContext";
import axios from "axios";
import { PenLine } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfileHeaderSection() {
    const [edit, setEdit] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropAreaRef = useRef<HTMLLabelElement | null>(null);
    const imageViewRef = useRef<HTMLDivElement | null>(null);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const TOKEN = localStorage.getItem('token') ? localStorage.getItem('token') : toast.error("Token is missing");



    const { user, updateUser } = useUserContext();

    function uploadImage(file: File) {
        const imgLink = URL.createObjectURL(file);
        setImageUrl(imgLink);
        setSelectedFile(file);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            uploadImage(e.target.files[0]);
        }
    }

    function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadImage(e.dataTransfer.files[0]);
            // Optionally, update the input's files (not always necessary)
            if (inputRef.current) {
                // @ts-ignore: Setting files programmatically is not standard, but we can ignore for preview
                inputRef.current.files = e.dataTransfer.files;
            }
        }
    }

    function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
    }

    const handleHeaderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Select a image first!");
            return;
        }
        const toastId = toast.loading("Uploading avatar ...")
        const fileName = `${Date.now()}.${selectedFile.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, selectedFile, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Upload error:', error.message);
            toast.error('Upload failed! : ' + error.message, { id: toastId });
        } else {
            const imagePath = SUPABASE_URL + "/storage/v1/object/public/" + data.fullPath
            console.log(imagePath)
            try {
                const response = await axios.patch(
                    `${BASE_URL}/api/user/update/avatar`,
                    { avatar: imagePath },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            Accept: "application/json",
                        }
                    }
                )
                console.log(response);
                updateUser(response.data)
                toast.success("Avatar successfully updated!!", { id: toastId });
                setEdit(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.data.details) {
                        toast.error(error.response?.data.details[0].message, { id: toastId });
                    } else {
                        toast.error(error.response?.data.error, { id: toastId });
                    }
                } else {
                    toast.error(error instanceof Error ? error.message : "Something went wrong")
                }
            }
            setEdit(false);
        }
    };

    const handleCancel = () => {
        setEdit(false);
        setImageUrl(null);
        setSelectedFile(null); // Clear selected file on cancel
    };

    const handleClear = () => {
        setImageUrl(null);
        setSelectedFile(null);
        if (inputRef.current) inputRef.current.value = ''; // Reset file input
    };

    return (
        <div className="border border-gray-200/20 rounded-md p-4 mx-1 flex items-center justify-between mb-6">
            {!edit ? (
                <>
                    <div className="flex items-center gap-4">
                        <img src={user.avatar ? user.avatar : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38184074.jpg-M4vCjTSSWVw5RwWvvmrxXBcNVU8MBU.jpeg"} alt="profile pic" className="rounded-full w-24 h-24 object-cover" />
                        <div>
                            <p className="font-semibold text-lg">{user.first_name} {user.last_name}</p>
                            <p className="text-gray-400">Trainee Software Developer</p>
                            <p className="text-gray-500">@Siygen (Private) Limited</p>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-full cursor-pointer flex items-center gap-2" onClick={() => setEdit(true)}><PenLine className="h-4 w-4" />Edit</Button>
                </>
            ) : (
                <div className="w-full flex flex-col items-center justify-center">
                    <Label htmlFor="image_input" id="dropArea" ref={dropAreaRef} className="w-50 h-50 cols-span-1 flex items-center border-1 border-gray-600 rounded-full" onDrop={handleDrop} onDragOver={handleDragOver}>
                        <Input type="file" form="header-form" name="image_input" id="image_input" accept=".png, .jpg, .jpeg" hidden ref={inputRef} onChange={handleInputChange} />
                        <div
                            id="image-view"
                            ref={imageViewRef}
                            className="flex flex-col items-center justify-center text-center w-full h-full bg-center bg-cover rounded-full overflow-hidden aspect-square"
                            style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : { backgroundImage: `url(${user.avatar})` }}
                        >
                            {!selectedFile && !user.avatar &&(
                                <>
                                    <svg id="upload-icon" xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500"
                                        viewBox="0 0 32 32">
                                        <path
                                            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                                        <path
                                            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
                                    </svg>
                                    <p className="text-sm">Drag and Drop or click here to upload an image</p>
                                </>
                            )}
                        </div>
                    </Label>
                    <form id="header-form" className="flex gap-2 mt-4 justify-center" onSubmit={handleHeaderSubmit}>
                        <Button variant="outline" type="button" className="cursor-pointer" onClick={handleCancel}>Cancel</Button>
                        <Button type="reset" variant="secondary" className="cursor-pointer" onClick={handleClear}>Clear</Button>
                        <Button type="submit" className="cursor-pointer">Update</Button>
                    </form>
                </div>
            )}
        </div>
    )
}