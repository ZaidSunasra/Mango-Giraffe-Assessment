import z from "zod/v4"

export const settingsSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    clientSecret: z.string().min(1, "Client Secret is required"),
    productInstanceId: z.string().min(1, "Product Instance ID is required"),
})
export type SettingsFormData = z.infer<typeof settingsSchema>

export const statusSchema = z.object({
    requestId: z.string().min(1, "Request ID is required").max(100, "Request ID is too long"),
})
export type StatusFormData = z.infer<typeof statusSchema>


export const uploadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    phoneNumber: z.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must be 10 digits").regex(/^[0-9]+$/, "Phone number must contain only digits"),
    birthYear: z.string().min(4, "Birth year must be 4 digits").max(4, "Birth year must be 4 digits").regex(/^[0-9]+$/, "Birth year must be a valid year"),
    document: z.any().refine((file) => file?.length > 0, "Document is required"),
})
export type UploadFormData = z.infer<typeof uploadSchema>
