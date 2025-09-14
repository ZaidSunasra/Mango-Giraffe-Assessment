import { useState } from "react"
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
import { Activity, Search, RefreshCw, XCircle, AlertTriangle, FileText, Loader2, } from "lucide-react"
import { useSignatureStatus } from "@/api/queries"
import { useDocumentDownload } from "@/api/mutations"
import { statusSchema, type StatusFormData } from "@/zodSchema"
import { statusConfig } from "@/constants"

export default function StatusPage() {

    const getStoredSignatureId = () => {
        const stored = localStorage.getItem("IDs")
        if (!stored) return ""
        try {
            const parsed = JSON.parse(stored)
            return parsed.signatureId || ""
        } catch {
            return ""
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
    const credentials = getStoredCredentials();

    const [currentRequestId, setCurrentRequestId] = useState<string>(getStoredSignatureId())

    const form = useForm<StatusFormData>({
        resolver: zodResolver(statusSchema),
        defaultValues: {
            requestId: getStoredSignatureId(),
        },
    })

    const { data: signatureStatus, isLoading, error, refetch, isRefetching } = useSignatureStatus(currentRequestId, credentials);
    const downloadDocument = useDocumentDownload();

    const onSubmit = (data: StatusFormData) => {
        setCurrentRequestId(data.requestId);
        refetch();
    }

    const handleRefresh = () => {
        if (currentRequestId) {
            refetch()
        }
    }

    const handleDownload = () => {
        downloadDocument.mutate({
            id: currentRequestId,
            credentials: getStoredCredentials()
        })
        localStorage.removeItem("IDs");
    }

    const getStatusConfig = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig]
    }

    return (
        <div className="bg-accent min-h-screen flex">
            <AppSidebar />
            <div className="flex-1 p-4">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-semibold">Signature Status</h1>
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
                                    page before checking signature status.
                                </AlertDescription>
                            </Alert>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Check Signature Status</CardTitle>
                                <CardDescription>
                                    Enter the signature request ID to check the current status of your document signing process.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="requestId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Signature Request ID</FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Enter signature request ID"
                                                                {...field}
                                                                className="font-mono text-sm"
                                                            />
                                                            <Button type="submit" disabled={isLoading || !credentials}>
                                                                {isLoading ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Search className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is the signature ID returned when you uploaded your document.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        {signatureStatus && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            Signature Status
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching}>
                                                {isRefetching ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed">
                                        <div className="text-center space-y-3">
                                            {(() => {
                                                const config = getStatusConfig(signatureStatus.status)
                                                const IconComponent = config.icon
                                                return (
                                                    <>
                                                        <div className="flex justify-center">
                                                            <div className={`p-3 rounded-full ${config.color}`}>
                                                                <IconComponent className="h-8 w-8" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Badge className={`${config.color} text-base px-3 py-1`}>{config.label}</Badge>
                                                            <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
                                                        </div>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                    {signatureStatus.status == "in_progress" && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Signature in progress...</span>
                                                <span>Processing</span>
                                            </div>
                                            <Progress value={75} className="w-full" />
                                            <p className="text-xs text-muted-foreground">
                                                The signer is currently completing the Aadhaar eSign process.
                                            </p>
                                        </div>
                                    )}
                                    {signatureStatus.status === "sign_complete" && (
                                        <div className="pt-4 border-t">
                                            <Button
                                                onClick={handleDownload}
                                                className="w-full"
                                                size="lg"
                                                disabled={downloadDocument.isPending}
                                            >
                                                {downloadDocument.isPending ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Preparing Download...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Download Signed Document
                                                    </>
                                                )}
                                            </Button>
                                            <p className="text-xs text-muted-foreground text-center mt-2">
                                                Click to download your digitally signed PDF document
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        {error && (
                            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    <strong>Error:</strong> {error.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
