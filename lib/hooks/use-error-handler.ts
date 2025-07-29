import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

export function useErrorHandler() {
  const { toast } = useToast()
  
  return useCallback((error: any, context?: string) => {
    console.error(`Error in ${context}:`, error);
    
    const message = error.response?.data?.message || error.message || 'Erro inesperado';
    
    toast({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);
}