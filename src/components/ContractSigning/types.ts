import { ContractFormData } from "../ContractGenerator/types";

// ─── Agreement Status ──────────────────────────────────────────────
export type AgreementStatus =
  | "pending"
  | "in_progress"
  | "signed"
  | "expired"
  | "cancelled";

// ─── Signing Field Types ───────────────────────────────────────────
export type SigningFieldType =
  | "signature"
  | "initials"
  | "checkbox"
  | "date"
  | "text";

export interface SigningField {
  id: string;
  type: SigningFieldType;
  label: string;
  required: boolean;
  sectionRef: string; // id for scroll target
  completed: boolean;
  value: string | boolean;
}

// ─── Signature Data ────────────────────────────────────────────────
export type SignatureMethod = "draw" | "type" | "upload";

export interface SignatureData {
  method: SignatureMethod;
  dataUrl: string; // base64 image or typed text rendered
  displayText?: string; // for typed signatures
}

// ─── Agreement Model ───────────────────────────────────────────────
export interface Agreement {
  id: string;
  title: string;
  status: AgreementStatus;
  contractData: ContractFormData;
  signerName: string;
  signerEmail: string;
  createdAt: string;
  expiresAt: string;
  signedAt?: string;
  referenceNumber: string;
}

// ─── Signing Session ───────────────────────────────────────────────
export interface SigningSession {
  agreement: Agreement;
  fields: SigningField[];
  signature: SignatureData | null;
  initials: SignatureData | null;
  consentChecked: boolean;
  termsAccepted: boolean;
}

// ─── Default signing fields ────────────────────────────────────────
export const createDefaultSigningFields = (
  clientName: string,
): SigningField[] => [
  {
    id: "review-contract",
    type: "checkbox",
    label: "I have reviewed the entire contract",
    required: true,
    sectionRef: "field-review-contract",
    completed: false,
    value: false,
  },
  {
    id: "confirm-identity",
    type: "text",
    label: "Full Legal Name",
    required: true,
    sectionRef: "field-confirm-identity",
    completed: !!clientName,
    value: clientName || "",
  },
  {
    id: "initial-scope",
    type: "initials",
    label: "Initial: Scope of Work",
    required: true,
    sectionRef: "field-initial-scope",
    completed: false,
    value: "",
  },
  {
    id: "initial-payment",
    type: "initials",
    label: "Initial: Payment Terms",
    required: true,
    sectionRef: "field-initial-payment",
    completed: false,
    value: "",
  },
  {
    id: "initial-warranty",
    type: "initials",
    label: "Initial: Warranty Terms",
    required: true,
    sectionRef: "field-initial-warranty",
    completed: false,
    value: "",
  },
  {
    id: "client-signature",
    type: "signature",
    label: "Client Signature",
    required: true,
    sectionRef: "field-client-signature",
    completed: false,
    value: "",
  },
  {
    id: "signing-date",
    type: "date",
    label: "Signing Date",
    required: true,
    sectionRef: "field-signing-date",
    completed: true,
    value: new Date().toISOString().split("T")[0],
  },
  {
    id: "consent-esign",
    type: "checkbox",
    label: "I consent to electronic signature",
    required: true,
    sectionRef: "field-consent-esign",
    completed: false,
    value: false,
  },
  {
    id: "terms-accepted",
    type: "checkbox",
    label: "I have read and agree to all terms",
    required: true,
    sectionRef: "field-terms-accepted",
    completed: false,
    value: false,
  },
];

// ─── Demo Agreement (for development / preview) ────────────────────
export const createDemoAgreement = (
  contractData: ContractFormData,
): Agreement => ({
  id: `AGR-${Date.now().toString(36).toUpperCase()}`,
  title: "Painting Contract Agreement",
  status: "pending",
  contractData,
  signerName: contractData.clientName || "Client",
  signerEmail: contractData.clientEmail || "",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  referenceNumber: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
});
