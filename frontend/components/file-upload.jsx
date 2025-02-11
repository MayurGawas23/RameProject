import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

const FileUpload = ({ file, setFile, uploadedFileUrl, setUploadedFileUrl, fileLoading, setFileLoading }) => {
    const inputRef = useRef(null);

    function handleFileChange(event) {
        console.log(event.target.files)
        const selectedFile = event.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    }

    function handleDragover(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setFile(droppedFile);
    }

    function handleRemoveFile() {
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function uploadFileToCloudinary() {
        setFileLoading(true);

        const data = new FormData();
        data.append("file", file);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-file`, data);
            console.log(response, 'response')
            if (response.data?.success) {
                setUploadedFileUrl(response.data.url);
         

            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setFileLoading(false);
        }
    }

    useEffect(() => {
        if (file) uploadFileToCloudinary();
    }, [file]);

    return (
        <div className="w-[300px] mx-auto">
            <div onDragOver={handleDragover} onDrop={handleDrop} className="border-2 border-dashed h-[110px] w-[300px] rounded-lg p-4">
                <Input id="file-upload" type="file" className="hidden" ref={inputRef} onChange={handleFileChange} />
                {!file ? (
                    <Label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & Drop or click to upload file</span>
                    </Label>
                ) : fileLoading ? (
                    <Skeleton className="h-20 bg-gray-400" />
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileIcon className="w-7 h-7 text-primary mr-2" />
                        </div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveFile}>
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                )}
            </div>
            {uploadedFileUrl && (
                <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block">
                    View Uploaded File
                </a>
            )}


        </div>
    );
};

export default FileUpload;
