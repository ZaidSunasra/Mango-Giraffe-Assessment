import type { APICredentials, SignatureStatus } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { getSignatureStatus } from "./api"

export const useSignatureStatus = (signatureId: string, credentials: APICredentials ) => {
    return useQuery<SignatureStatus>({
        queryKey: ["signatures", signatureId],
        queryFn: async () => getSignatureStatus(signatureId, credentials),
        enabled: !!signatureId && !!credentials,
        //refetchInterval: 5000,
        retry: 3,
        staleTime: 1000, 
    })
}