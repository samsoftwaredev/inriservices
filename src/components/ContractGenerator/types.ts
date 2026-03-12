export interface ContractFormData {
  // Section 1 — Agreement Information
  agreementDate: string;
  clientName: string;
  clientAddress: string;

  // Section 2 — Client Contact Information
  clientPhone: string;
  clientEmail: string;

  // Section 3 — Scope of Work
  typeOfProject: string;
  customerDetails: string;
  areasRooms: string;
  prepWork: string;
  numberOfCoats: string;
  paintBrand: string;
  exclusions: string;

  // Section 4 — Project Timeline
  startDate: string;
  completionDate: string;
  workStartTime: string;
  workEndTime: string;

  // Section 5 — Payment Terms
  totalCost: string;
  depositAmount: string;

  // Section 6 — Warranty
  warrantyMonths: string;

  // Section 7 — Signatures
  clientSignatureName: string;
  contractorName: string;
}

export const defaultContractValues: ContractFormData = {
  agreementDate: "",
  clientName: "",
  clientAddress: "",
  clientPhone: "",
  clientEmail: "",
  typeOfProject: "",
  customerDetails: "",
  areasRooms: "",
  prepWork: "",
  numberOfCoats: "2",
  paintBrand: "",
  exclusions: "",
  startDate: "",
  completionDate: "",
  workStartTime: "08:00",
  workEndTime: "17:00",
  totalCost: "",
  depositAmount: "",
  warrantyMonths: "6",
  clientSignatureName: "",
  contractorName: "Samuel / INRI Paint & Wall LLC",
};
