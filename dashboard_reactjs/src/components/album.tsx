import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRef, useEffect, useCallback, memo, useMemo } from "react"
import { AlertCircle, CheckCircle, Trash } from "lucide-react"
import { IAlbum } from "@/interfaces/post/post-catalogues.interface"
import useUpload, { IUploadedFile } from "@/hooks/useUpload"
import { Progress } from "@/components/ui/progress"
import { useFormContext } from "react-hook-form"

interface IalbumProps {
    data: IAlbum[],
    sessionId?: string
}

const ImageWithProgress = memo(({ file, index, onRemove }: { file: IUploadedFile, index: number, onRemove: () => void }) => {
    const isUploading = file.status === 'uploading'
    const isSuccess = file.status === 'success'
    const isError = file.status === 'error'

    return (
        <>
            <div className="w-full h-[130px] relative shadow cursor-pointer border rounded-[5px] overflow-hidden">
                <img src={file.url} alt={`upload${index + 1}`}
                    className={`object-cover size-full transition-opacity duration-300 ${isUploading ? 'opacity-50' : 'opacity-100'}`} />
            </div>
            {isUploading && (
                <div className="absolute bottom-0 left-0 w-full h-[20px] p-[5px] bg-black bg-opacity-50 text-white text-xs flex items-center justify-between">
                    <div className="w-3/4 mb-2">
                        <Progress
                            value={file.progress}
                            className="h-2 bg-gray-200"
                        />
                    </div>
                    <span className=" absolute right-[5px] bottom-0 top-[6px] text-xs font-medium text-white ">{file.progress}%</span>
                </div>
            )}
            {isError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500 opacity-50">
                    <AlertCircle className="text-white size-6 mb-[10px]" />
                    <span className="px-2 text-xs text-center text-white">
                        Upload failed
                    </span>
                </div>
            )}
            {isSuccess && (
                <div className="absolute top-0 left-0">
                    <CheckCircle className="p-1 text-white bg-green-400 rounded-full shadow-md size-5 animate-pop" />
                </div>
            )}
            <button
                className="absolute right-[0px] top-[0px] size-[20px] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-red-100 transition-colors"
                onClick={onRemove}
            >
                <Trash className="text-gray-500 transition-colors size-4 hover:text-red-500" />
            </button>
        </>
    )
})


const apiUrl = import.meta.env.VITE_API_URL


const Album = ({ data, sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }: IalbumProps) => {
    const { setValue } = useFormContext()
    const fileInputRef = useRef<HTMLInputElement>(null)
    // const [preview, setPreview] = useState<string[]>([])
    // const [files, setFiles] = useState<File[]>([])
    // const [existingImage, setExistingImage] = useState<IAlbum[]>([])

    const { uploadFiles,
        //getUploadingFile,
        uploadingFiles,
        removeUploadingFile,
        //uploadSuccessfulFile,
        //isUploading 
    } = useUpload({
        onSuccess: (file: IUploadedFile) => {
            console.log(file);
        },
        onError: (error: string, fieldId: string) => {
            console.error('upload error:', error, fieldId)
        }
    })

    // useEffect(() => {
    //     if (data && data.length > 0) {
    //         setExistingImage(data)
    //     }
    // }, [data])

    // củ
    const handleFileChange = useCallback(async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return
        const validFiles: File[] = []
        Array.from(fileList).forEach(file => {
            if (!file.type.startsWith('image/')) {
                console.error(`File${file.name} không phải là ảnh`)
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                console.error(`File ${file.name} quá lớn , vui lòng chọn ảnh dưới 5MB`)
                return
            }
            validFiles.push(file)
        })

        if (validFiles.length === 0) return
        const dataTransfer = new DataTransfer()
        validFiles.forEach(file => {
            dataTransfer.items.add(file)
        })
        await uploadFiles(dataTransfer.files, sessionId)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

    }, [sessionId, uploadFiles])




    const allImages: IUploadedFile[] = useMemo(() => {
        const existingImage = data.map((item => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            url: item.fullPath,
            originalName: item.path,
            size: 0,
            progress: 0,
            status: 'success'
        })))
        return [...existingImage, ...uploadingFiles] as IUploadedFile[]
    }, [data, uploadingFiles])



    const handleRemoveFile = useCallback((fileId: string) => {
        removeUploadingFile(fileId)
    }, [removeUploadingFile])


    // củ
    useEffect(() => {
        if (allImages.length > 0) {
            const albumData = allImages.map(item => ({
                path: item.url.replace(apiUrl, '')
            }))
            setValue('album', albumData)
        }

    }, [allImages])



    const hasImage = useMemo(() => {
        return allImages.length > 0
    }, [allImages])

    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px]">Ablum ảnh</span>
                            <span className="text-[13px] text-[blue] cursor-pointer" onClick={() => fileInputRef.current?.click()}>Chọn hình ảnh</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                            handleFileChange(e.target.files)
                            console.log('Selected files:', e.target.files);
                        }
                        }
                    />
                    {!hasImage ? (
                        <div className="border border-dashed border-gray-500 rounded-[5px] text-center p-[10px]">
                            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <svg className="size-[80px] fill-[#d3dbe2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path d="M80 57.6l-4-18.7v-23.9c0-1.1-.9-2-2-2h-3.5l-1.1-5.4c-.3-1.1-1.4-1.8-2.4-1.6l-32.6 7h-27.4c-1.1 0-2 .9-2 2v4.3l-3.4.7c-1.1.2-1.8 1.3-1.5 2.4l5 23.4v20.2c0 1.1.9 2 2 2h2.7l.9 4.4c.2.9 1 1.6 2 1.6h.4l27.9-6h33c1.1 0 2-.9 2-2v-5.5l2.4-.5c1.1-.2 1.8-1.3 1.6-2.4zm-75-21.5l-3-14.1 3-.6v14.7zm62.4-28.1l1.1 5h-24.5l23.4-5zm-54.8 64l-.8-4h19.6l-18.8 4zm37.7-6h-43.3v-51h67v51h-23.7zm25.7-7.5v-9.9l2 9.4-2 .5zm-52-21.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm-13-10v43h59v-43h-59zm57 2v24.1l-12.8-12.8c-3-3-7.9-3-11 0l-13.3 13.2-.1-.1c-1.1-1.1-2.5-1.7-4.1-1.7-1.5 0-3 .6-4.1 1.7l-9.6 9.8v-34.2h55zm-55 39v-2l11.1-11.2c1.4-1.4 3.9-1.4 5.3 0l9.7 9.7c-5.2 1.3-9 2.4-9.4 2.5l-3.7 1h-13zm55 0h-34.2c7.1-2 23.2-5.9 33-5.9l1.2-.1v6zm-1.3-7.9c-7.2 0-17.4 2-25.3 3.9l-9.1-9.1 13.3-13.3c2.2-2.2 5.9-2.2 8.1 0l14.3 14.3v4.1l-1.3.1z"></path></svg>
                                <p className="text-sm text-gray-500">
                                    Sử dụng nút chọn hình ảnh hoặc click vào đây để thêm hình ảnh album
                                </p>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="grid grid-cols-8 gap-4">
                                {allImages && allImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <ImageWithProgress
                                            file={file}
                                            index={index}
                                            onRemove={() => handleRemoveFile(file.id)} />
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </>
    )
}

export default memo(Album)