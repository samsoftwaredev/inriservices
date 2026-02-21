# Financial Report PDF Component

CPA-ready financial PDF report generator using @react-pdf/renderer.

## Usage

```tsx
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FinancialReportPDF } from "@/components/FinancialReportPDF";
import type {
  FinancialReportData,
  ReportTransaction,
} from "@/components/FinancialReportPDF";

// Transform your transactions to match the expected format
const transformTransactions = (
  transactions: FinancialTransaction[],
): ReportTransaction[] => {
  return transactions.map((tx) => ({
    id: tx.id,
    date: tx.transaction_date,
    amount: tx.amount_cents,
    currency: "USD",
    description: tx.description,
    memo: tx.memo,
    vendor: tx.vendor?.name,
    category: tx.account?.name,
    type: tx.account?.type || "expense",
    account: tx.account?.code,
    payment_method: tx.payment_method,
    external_id: tx.external_id,
    reference_number: tx.reference_number,
    notes: tx.notes,
    tags: tx.tags,
    has_receipt: !!tx.receipt_id,
    receipt_url: tx.receipt_url,
    attachment_name: tx.attachment_name,
  }));
};

// Prepare the report data
const reportData: FinancialReportData = {
  company: {
    name: "Your Company Name",
    address: "123 Main St, City, State 12345",
    phone: "(555) 123-4567",
    email: "info@company.com",
    taxId: "12-3456789",
  },
  period: {
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    year: 2024,
    accountingMethod: "Cash",
  },
  prepared: {
    preparedFor: "CPA Name (Optional)",
    preparedBy: "Owner Name",
    generatedDate: new Date().toISOString(),
  },
  transactions: transformTransactions(yourTransactions),
};

// Render download link
<PDFDownloadLink
  document={<FinancialReportPDF data={reportData} />}
  fileName={`financial-report-${reportData.period.year}.pdf`}
>
  {({ loading }) =>
    loading ? "Generating PDF..." : "Download Financial Report"
  }
</PDFDownloadLink>;
```

## Report Sections

1. **Cover Page** - Business info, period, accounting method
2. **Financial Summary** - High-level totals and metrics
3. **Owner Activity** - Contributions and draws breakdown
4. **Operating Expenses** - Category breakdown with percentages
5. **Net Profit Details** - P&L calculation
6. **Full Transactions** - Complete transaction ledger
7. **Attachments Index** - Transactions with receipts
8. **CPA Notes** - Blank section for review notes

## Data Requirements

Ensure transactions include:

- `date`, `amount` (in cents), `description`
- `vendor`, `category`, `type`
- `has_receipt` boolean for attachment tracking
