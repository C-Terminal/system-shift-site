// src/lib/types/sla.ts
export interface SlaFormData {
    effectiveDate: string;
    clientName: string;
    clientSignature: string; // Base64 data URL from canvas
    providerSignature: string; // Base64 data URL from canvas
  }
  
  export interface FormErrors {
    effectiveDate?: string;
    clientName?: string;
    clientSignature?: string;
    providerSignature?: string;
    general?: string; // For server errors like DB failures
  }
  
  export interface SlaFormResponse {
    success?: boolean;
    errors?: FormErrors;
    effectiveDate?: string; // Repopulate on error
    clientName?: string;
    clientSignature?: string;
    providerSignature?: string;
  }