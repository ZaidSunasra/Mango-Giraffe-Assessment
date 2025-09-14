import type React from "react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import AppSidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, User, Phone, Calendar, AlertTriangle, CheckCircle, ExternalLink, Loader2, } from "lucide-react"
import { toast } from "sonner"
import { useDocumentUpload } from "@/api/mutations"
import { uploadSchema, type UploadFormData } from "@/zodSchema"
import type { UploadResponse } from "@/types"

const UploadPage = () => {

    const getStoredIds = () => {
        const stored = localStorage.getItem("IDs")
        if (!stored) return null
        try {
            const parsed = JSON.parse(stored)
            return {
                documentId: parsed.documentId || null,
                signatureId: parsed.signatureId || null,
                signatureUrl: parsed.signatureUrl || null,
                status: parsed.status || null
            }
        } catch {
            return null
        }
    }

    const getStoredCredentials = () => {
        const stored = localStorage.getItem("setu-api-credentials")
        if (!stored) return null
        try {
            return JSON.parse(stored)
        } catch {
            return null
        }
    }
    const credentials = getStoredCredentials()

    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(getStoredIds());
    const fileRef = useRef<HTMLInputElement>(null)

    const form = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            name: "",
            phoneNumber: "",
            birthYear: "",
            document: null,
        },
    })

    const uploadMutation = useDocumentUpload((progress) => setUploadProgress(progress), (result) => setUploadResult(result))
    const onSubmit = (formData: UploadFormData) => {
        setUploadProgress(0)
        setUploadResult(null)
        uploadMutation.mutate({
            formData,
            credentials: getStoredCredentials()
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            if (file.type === "application/pdf") {
                if (file.size > 10 * 1024 * 1024) {
                    toast.error("File too large", {
                        description: "Please upload a PDF file smaller than 10MB."
                    })
                    return
                }
                form.setValue("document", files)
            } else {
                toast.error("Invalid file type", {
                    description: "Please upload a PDF file only."
                })
            }
        }
    }

    return (
        <div className="bg-accent min-h-screen flex">
            <AppSidebar />
            <div className="flex-1 p-4">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-semibold">Upload Document</h1>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="mx-auto w-full max-w-2xl space-y-6">
                        {!credentials && (
                            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    <strong>Configuration Required:</strong> Please configure your Setu API credentials in the{" "}
                                    <a href="/settings" className="underline font-medium">
                                        Settings
                                    </a>{" "}
                                    page before uploading documents.
                                </AlertDescription>
                            </Alert>
                        )}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Uploading document...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="w-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {uploadResult && (
                            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                                        <CheckCircle className="h-5 w-5" />
                                        Upload Successful
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Document ID:</span>
                                            <p className="font-mono text-xs break-all">{uploadResult.documentId}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Signature ID:</span>
                                            <p className="font-mono text-xs break-all">{uploadResult.signatureId}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Status:</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {uploadResult.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button onClick={() => window.open(uploadResult.signatureUrl, "_blank")} className="w-full">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Open Signature URL
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Document Upload & Signer Details</CardTitle>
                                <CardDescription>
                                    Upload your PDF document and provide signer information for Aadhaar-based digital signature.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="document"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Document (PDF)</FormLabel>
                                                    <FormControl>
                                                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                                            <div className="space-y-2">
                                                                <p className="text-xs text-muted-foreground">
                                                                    Maximum file size: 10MB. Only PDF files are supported.
                                                                </p>
                                                            </div>
                                                            <Input
                                                                type="file"
                                                                accept=".pdf,application/pdf"
                                                                value={field.value?.fileName}
                                                                onChange={handleFileChange}
                                                                id="document-upload"
                                                                ref={fileRef}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                <h3 className="text-sm font-medium">Signer Information</h3>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter full name as per Aadhaar" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Name should match exactly with your Aadhaar card</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <div className="flex">
                                                                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                                                                    <Phone className="h-4 w-4 mr-1" />
                                                                    +91
                                                                </div>
                                                                <Input
                                                                    placeholder="Enter 10-digit mobile number"
                                                                    {...field}
                                                                    className="rounded-l-none"
                                                                    maxLength={10}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>Mobile number linked with your Aadhaar card</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="birthYear"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Birth Year</FormLabel>
                                                        <FormControl>
                                                            <div className="flex">
                                                                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                                                                    <Calendar className="h-4 w-4" />
                                                                </div>
                                                                <Input placeholder="YYYY" {...field} className="rounded-l-none" maxLength={4} />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>Year of birth as per your Aadhaar card</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type="submit" disabled={uploadMutation.isPending || !credentials} className="w-full">
                                            {uploadMutation.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload & Initiate Signature
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Important Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong>Document Requirements:</strong> Only PDF files up to 10MB are supported for signing.
                                </div>
                                <div>
                                    <strong>Aadhaar Verification:</strong> Ensure your details match exactly with your Aadhaar card.
                                </div>
                                <div>
                                    <strong>Signature Process:</strong> After upload, you'll be redirected to complete the eSign process
                                    using your Aadhaar OTP.
                                </div>
                                <div>
                                    <strong>Security:</strong> All documents are processed securely and deleted after the signing process.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadPage;