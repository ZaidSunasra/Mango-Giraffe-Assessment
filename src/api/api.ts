import { axiosInstance } from "./axiosInstance"
import { type UploadFormData, type APICredentials, type DownloadResponse } from "@/types"

export const uploadDocument = async (data: UploadFormData, credentials: APICredentials) => {
    const formData = new FormData()
    formData.append("name", data.document[0].name)
    formData.append("document", data.document[0])
    const response = await axiosInstance.post("/documents", formData, {
        headers: {
            "x-client-id": credentials.clientId,
            "x-client-secret": credentials.clientSecret,
            "x-product-instance-id": credentials.productInstanceId,
        },
    })
    return response.data
}

export const initiateSignature = async (data: { documentId: string, name: string, phoneNumber: string, birthYear: string }, credentials: APICredentials) => {
    const response = await axiosInstance.post("/signature", {
        documentId: data.documentId,
        redirectUrl: "http://setu.co",
        signers: [{
            displayName: data.name,
            identifier: data.phoneNumber,
            birthYear: data.birthYear,
            signature: {
                height: 60,
                onPages: ["1"],
                position: "bottom-left",
                width: 180
            }
        }]
    }, {
        headers: {
            "Content-Type": "application/json",
            "x-client-id": credentials.clientId,
            "x-client-secret": credentials.clientSecret,
            "x-product-instance-id": credentials.productInstanceId,
        },
    })
    return response.data
}

export const getSignatureStatus = async (id: string, credentials: APICredentials): Promise<any> => {
    const response = await axiosInstance.get(`/signature/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-client-id": credentials.clientId,
            "x-client-secret": credentials.clientSecret,
            "x-product-instance-id": credentials.productInstanceId,
        }
    });
    return response.data;
}

export const downloadDocument = async ({id, credentials} : {id: string, credentials: APICredentials}): Promise<DownloadResponse> => {
    const response = await axiosInstance.get(`/signature/${id}/download`, {
        headers: {
            "Content-Type": "application/json",
            "x-client-id": credentials.clientId,
            "x-client-secret": credentials.clientSecret,
            "x-product-instance-id": credentials.productInstanceId,
        }
    });
    return response.data;
}