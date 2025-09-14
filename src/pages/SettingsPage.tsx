import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import AppSidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, AlertTriangle, Save, Eye, EyeOff, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { settingsSchema, type SettingsFormData } from "@/zodSchema"


const SettingsPage = () => {
    const [showSecrets, setShowSecrets] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasStoredCredentials, setHasStoredCredentials] = useState(false)

    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            clientId: "",
            clientSecret: "",
            productInstanceId: "",
        },
    })

    useEffect(() => {
        const storedCredentials = localStorage.getItem("setu-api-credentials");
        if (storedCredentials) {
            try {
                const credentials = JSON.parse(storedCredentials)
                form.reset({
                    clientId: credentials.clientId || "",
                    clientSecret: credentials.clientSecret || "",
                    productInstanceId: credentials.productInstanceId || "",
                })
                setHasStoredCredentials(true)
            } catch (error) {
                console.error("Failed to parse stored credentials:", error)
            }
        }
    }, [form])

    const onSubmit = async (data: SettingsFormData) => {
        setIsLoading(true)
        try {
            const credentials = {
                clientId: data.clientId,
                clientSecret: data.clientSecret,
                productInstanceId: data.productInstanceId,
                updatedAt: new Date().toISOString(),
            }
            localStorage.setItem("setu-api-credentials", JSON.stringify(credentials))
            setHasStoredCredentials(true)
            toast.success("Settings saved successfully", {
                description: "Your API credentials have been stored locally.",
            })
        } catch (error) {
            toast.error("Error saving settings", {
                description: "Failed to save your credentials. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const clearCredentials = () => {
        localStorage.removeItem("setu-api-credentials")
        form.reset({
            clientId: "",
            clientSecret: "",
            productInstanceId: "",
        })
        setHasStoredCredentials(false)
        toast.success("Credentials cleared", {
            description: "All stored API credentials have been removed.",
        })
    }

    return (
        <div className="bg-accent min-h-screen flex">
            <AppSidebar />
            <div className="flex-1 p-4">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        <h1 className="text-lg font-semibold">Settings</h1>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="mx-auto w-full max-w-2xl space-y-6">
                        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <AlertDescription className="text-amber-800 dark:text-amber-200">
                                <strong>Security Notice:</strong> API credentials will be stored in your browser's localStorage. This is
                                not secure for production use. Only use this for testing and development purposes.
                            </AlertDescription>
                        </Alert>
                        {hasStoredCredentials && (
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                >
                                    Credentials Configured
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearCredentials}
                                    className="text-red-600 hover:text-red-700 bg-transparent"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            </div>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Setu API Configuration</CardTitle>
                                <CardDescription>
                                    Configure your Setu API credentials to enable document signing functionality. These credentials will
                                    be used for all API requests.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="clientId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Client ID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your x-client-id" {...field} className="font-mono" />
                                                    </FormControl>
                                                    <FormDescription>Your Setu API client identifier (x-client-id)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="clientSecret"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Client Secret</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={showSecrets ? "text" : "password"}
                                                                placeholder="Enter your x-client-secret"
                                                                {...field}
                                                                className="font-mono pr-10"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowSecrets(!showSecrets)}
                                                            >
                                                                {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Your Setu API client secret (x-client-secret)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="productInstanceId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Instance ID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your x-product-instance-id" {...field} className="font-mono" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Your Setu product instance identifier (x-product-instance-id)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex gap-3 pt-4">
                                            <Button type="submit" disabled={isLoading} className="flex-1">
                                                <Save className="h-4 w-4 mr-2" />
                                                {isLoading ? "Saving..." : "Save Credentials"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">How to get your credentials</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <strong>1. Sign up for Setu:</strong> Visit the Setu developer portal and create an account
                                </div>
                                <div>
                                    <strong>2. Create a project:</strong> Set up a new project for Aadhaar eSign integration
                                </div>
                                <div>
                                    <strong>3. Get credentials:</strong> Copy your client ID, client secret, and product instance ID from
                                    the dashboard
                                </div>
                                <div>
                                    <strong>4. Use sandbox mode:</strong> Start with sandbox credentials for testing before going live
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage