import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from "react"
import { privateApi } from '@/config/axios'
import { AxiosProgressEvent } from 'axios'

export interface IUploadedFile {
    id: string,
    url: string,
    originalName: string,
    size: number,
    progress: number,
    status: 'uploading' | 'success' | 'error',
    error?: string
}
interface IUseUploadProps {
    onSuccess?: (file: IUploadedFile) => void,
    onError?: (error: string, fieldId: string) => void,
    onProgress?: (progress: number, fieldId: string) => void
}

interface uploadResponse {
    id: string,
    url: string,
}

interface uploadRequest {
    file: File,
    fileId: string,
    sessionId: string
}

const useUpload = (options: IUseUploadProps = {}) => {
    const [uploadingFiles, setUploadingFiles] = useState<Map<string, IUploadedFile>>(new Map())
    const uploadMuation = useMutation({
        mutationFn: async ({ file, fileId, sessionId }: uploadRequest): Promise<uploadResponse> => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('sessionId', sessionId)
            try {
                const response = await privateApi.post('v1/upload_temp', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    // cập nhật trạng thái tiến độ
                    onUploadProgress: (ProgressEvent: AxiosProgressEvent) => {
                        if (ProgressEvent.total) {
                            const progress = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                            setUploadingFiles(prev => {
                                const newMap = new Map(prev)
                                const existingFile = newMap.get(fileId)
                                if (existingFile) {
                                    newMap.set(fileId, { ...existingFile, progress })
                                    options.onProgress?.(progress, fileId)
                                }
                                return newMap
                            })
                        }
                    }
                })
                if (response.data) {
                    console.log(response.data)
                    return response.data as uploadResponse
                } else {
                    throw new Error('có vấn đề xảy ra trong quá trình tải ảnh lên')
                }
            } catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
                throw new Error('Có vấn đề xảy ra')
            }
        },
        // data là url file gốc của ảnh , variable là được truyền vào bởi  object { file, fileId, sessionId }
        //  chính là variables được truyền vào mutationFn.
        onSuccess: (data, variables) => {
            setUploadingFiles(prev => {
                const newMap = new Map(prev)
                const existingFile = newMap.get(variables.fileId)
                if (existingFile) {
                    const sucessFile = {
                        ...existingFile,
                        status: 'success' as const,
                        'progress': 100,
                        url: data.url
                    }
                    console.log(existingFile);
                    newMap.set(variables.fileId, sucessFile)

                }
                return newMap
            })
        },
        onError: (error, Variable) => {
            setUploadingFiles(prev => {
                const newMap = new Map(prev)
                const existingFile = newMap.get(Variable.fileId)
                if (existingFile) {
                    const errorFile = {
                        ...existingFile,
                        status: 'error' as const,
                        error: error.message
                    }
                    newMap.set(Variable.fileId, errorFile)
                }
                return newMap
            })
        }
    })


    // hàm bắt đầu tải nhiều file
    const uploadFiles = useCallback(async (files: FileList, sessionId: string) => {
        const fileArray = Array.from(files)
        fileArray.forEach(file => {
            const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            const uploadFile: IUploadedFile = {
                id: fileId,
                url: URL.createObjectURL(file),
                originalName: file.name,
                size: file.size,
                progress: 0,
                status: 'uploading'
            }
            setUploadingFiles(prev => new Map(prev.set(fileId, uploadFile)))
            uploadMuation.mutate({ file, fileId, sessionId })
        })
    }, [uploadMuation])


    // lấy thông tin 1 file đang tải dựa trên fieldId
    const getUploadingFile = useCallback((fileId: string) => {
        return uploadingFiles.get(fileId)
    }, [uploadingFiles])
    // hàm lấy tất cả mảng file được gửi lên    
    const getAllUploadingFiles = useCallback(() => {
        return Array.from(uploadingFiles.values())
    }, [uploadingFiles])
    // lấy ds file tải thành công
    const getSuccessfulFile = useCallback(() => {
        return Array.from(uploadingFiles.values()).filter(file => file.status === 'success')
    }, [uploadingFiles])
    // xóa 1 file khỏi danh sách
    const removeUploadingFile = useCallback((fileId: string) => {
        setUploadingFiles(prev => {
            const newMap = new Map(prev)
            const file = newMap.get(fileId)
            if (file && file.url.startsWith('blob:')) {
                URL.revokeObjectURL(file.url)
            }
            newMap.delete(fileId)
            return newMap
        })
    }, [])

    return {
        uploadFiles,
        getUploadingFile,
        removeUploadingFile,
        uploadingFiles: getAllUploadingFiles(),
        uploadSuccessfulFile: getSuccessfulFile(),
        isUploading: uploadMuation.isPending
    }
}
export default useUpload

