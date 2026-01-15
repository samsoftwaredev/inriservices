import {
  InvoiceData,
  InvoiceItem,
  Customer,
} from "@/components/InvoiceGenerator";

export interface EstimateRoom {
  id: string;
  name: string;
  description: string;
  cost?: number;
  features?: Array<{
    id: string;
    type: string;
    description: string;
    cost: number;
  }>;
}

export interface EstimateData {
  rooms: EstimateRoom[];
  customer?: Partial<Customer>;
  projectName?: string;
  notes?: string;
}

/**
 * Format currency for invoice display
 */
export const formatInvoiceCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Generate unique invoice number
 */
export const generateInvoiceNumber = (prefix: string = "INV"): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp.slice(-6)}-${random}`;
};
