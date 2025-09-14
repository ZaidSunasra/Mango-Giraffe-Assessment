import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadDocument, initiateSignature, downloadDocument } from "./api"
import { toast } from "sonner"
import type { APICredentials, UploadFormData } from "@/types"

export const useDocumentUpload = (onProgressUpdate: (progress: number) => void, onUploadSuccess: (result: any) => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { formData: UploadFormData; credentials: APICredentials }) => {
            if (!data.credentials) {
                throw new Error("API credentials not configured. Please go to Settings first.")
            }
            onProgressUpdate(25)
            const uploadData = await uploadDocument(data.formData, data.credentials);
            onProgressUpdate(60)
            const signatureData = await initiateSignature({
                documentId: uploadData.id,
                name: data.formData.name,
                phoneNumber: data.formData.phoneNumber,
                birthYear: data.formData.birthYear
            }, data.credentials)
            onProgressUpdate(100)
            localStorage.setItem("IDs", JSON.stringify({
                documentId: signatureData.documentId,
                signatureId: signatureData.id,
                signatureUrl: signatureData.signers[0].url,
                status: signatureData.status,
            }))
            return {
                documentId: signatureData.documentId,
                signatureId: signatureData.id,
                signatureUrl: signatureData.signers[0].url,
                status: signatureData.status,
            }
        },
        onSuccess: (data) => {
            onUploadSuccess(data)
            toast.success("Upload successful!", {
                description: "Your document has been uploaded and signature request initiated.",
            })
            queryClient.invalidateQueries({ queryKey: ["signatures"] })
        },
        onError: (error: Error) => {
            toast.error("Upload failed", {
                description: error.message,
            })
            onProgressUpdate(0)
        },
    })
}

export const useDocumentDownload = () => {
    return useMutation({
        mutationFn: downloadDocument,
        onSuccess: (data) => {
            const link = document.createElement('a')
            link.href = data.downloadUrl
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast.success("Download started", {
                description: "Your signed document will open in a new tab.",
            })
        },
        onError: (error: Error) => {
            toast.error("Download failed", {
                description: error.message,
            })
        }
    })
}