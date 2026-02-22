export interface ReportTransaction {
  id: string;
  date: string;
  amount: number;
  currency?: string;
  description: string;
  memo?: string;
  vendor?: string;
  category?: string;
  type: "revenue" | "expense" | "cogs" | "equity" | "asset" | "liability";
  account?: string;
  paymentMethod?: string;
  externalId?: string;
  referenceNumber?: string;
  notes?: string;
  tags?: string[];
  hasReceipt?: boolean;
  receiptUrls?: BucketFile[] | null;
  attachmentName?: string;
}

export interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
}

export interface ReportPeriod {
  startDate: string;
  endDate: string;
  year: number;
  accountingMethod?: "Cash" | "Accrual";
}

export interface PreparedInfo {
  preparedFor?: string;
  preparedBy?: string;
  generatedDate: string;
}

export interface FinancialReportData {
  company: CompanyInfo;
  period: ReportPeriod;
  prepared: PreparedInfo;
  transactions: ReportTransaction[];
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalOperatingExpenses: number;
  totalCOGS: number;
  netProfit: number;
  ownerContributions: number;
  ownerDraws: number;
  transactionCount: number;
  uncategorizedTotal: number;
}

export type BucketFile = { url: string; name: string };
