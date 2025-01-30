import { useEffect, useRef } from "react"
import { Input } from "./ui/input"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import axios from "axios"
import { Skeleton } from "./ui/skeleton"

const JournalCoverImg = ({ imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl, imageLoadingState, setImageLoadingState }) => {

    const inputRef = useRef(null)

    function handleImageFileChange(event) {
        console.log(event.target.files)
        const selectedFile = event.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    }

    function handleDragover(event) {
        event.preventDefault()
    }

    function handleDrop(event) {
        event.preventDefault()
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile)
    }

    function handleRemoveImage() {
        setImageFile(null)
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    async function uploadImageToCloudinary(){
       setImageLoadingState(true)
        const data  = new FormData();
        data.append('my_file', imageFile)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-image` , data)
        console.log(response, 'response')
        if(response.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false)
        }
           

    }

    useEffect(()=>{
        if(imageFile !== null ) uploadImageToCloudinary()
    },[imageFile])

    return (
        <div className="w-full max-w-md mx-auto">
            <label className="text-lg font-semibold mb-2 block">Upload Image </label>
            <div onDragOver={handleDragover} onDrop={handleDrop} className="border-2 border-dashed rounded-lg p-4 ">
                <Input id="image-upload" type="file" className="hidden" ref={inputRef} onChange={handleImageFileChange} />
                {
                    !imageFile ? (
                        <Label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer h-32">
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span> Drag & DROp or click to upload Image</span>
                        </Label>
                    ) : (
                        imageLoadingState ?
                        <Skeleton className='h-10 bg-gray-200'/>:
                        <div className="flex items-center justify-between">
                            <div className="flex items-center ">
                                <FileIcon className="w-7 h-7 text-primary mr-2" />
                            </div>
                            <p className="text-sm font-medium">{imageFile.name}</p>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground " onClick={handleRemoveImage}>
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only"> Remove File</span>
                            </Button>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default JournalCoverImg