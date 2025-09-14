export type APICredentials = {
    clientId: string
    clientSecret: string
    productInstanceId: string
}

export type UploadFormData = {
    name: string
    phoneNumber: string
    birthYear: string
    document: FileList
}

export type UploadResponse = {
    documentId: string
    signatureId: string
    signatureUrl: string
    status: string
}
export type SignatureStatus  = {
   documentId: string
    id: string
    redirectUrl: string
    status: string
}

export type DownloadResponse = {
    downloadUrl: string
    id: string
    validUpto: string
}

