import { RefreshCw, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const statusConfig = {
    sign_initiated: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
        icon: Clock,
        label: "Initiated",
        description: "Signature request has been initiated"
    },
    sign_pending: {
        color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
        icon: AlertTriangle,
        label: "Pending",
        description: "Waiting for signer to start the process"
    },
    sign_in_progress: {
        color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
        icon: RefreshCw,
        label: "In Progress",
        description: "Signer is currently completing the signature process"
    },
    sign_complete: {
        color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
        icon: CheckCircle,
        label: "Completed",
        description: "Document has been successfully signed"
    }
}