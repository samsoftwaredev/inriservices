# Finance Module - Documentation

## Overview

A comprehensive Finance module for contractor SaaS built with React (Next.js App Router), TypeScript, and MUI v7. This module handles accounting, transactions, vendors, and assets using a cash-basis accounting system.

## Core Accounting Model

- **Cash Basis**: Revenue is recorded only when payment is received (receipts/posted payments), not when invoices are created
- **Signed Amounts**:
  - Revenue: positive
  - Expense/COGS: negative
  - Owner contribution: positive
  - Owner draw: negative
  - Asset purchase: negative (cash out)

## Architecture

### Tables & APIs

| Table                    | API                        | Purpose                                                              |
| ------------------------ | -------------------------- | -------------------------------------------------------------------- |
| `accounts`               | `accountsApi`              | Chart of accounts (Revenue, COGS, Expense, Asset, Liability, Equity) |
| `vendors`                | `vendorsApi`               | Supplier/subcontractor management + 1099 support                     |
| `financial_transactions` | `financialTransactionsApi` | General ledger entries                                               |
| `financial_documents`    | `financialDocumentsApi`    | Receipt/document storage (private bucket)                            |
| `assets`                 | `assetsApi`                | Asset tracking for depreciation                                      |

All tables are multi-tenant enforced via RLS using `company_id`.

## Features

### 1. Finance Dashboard (`/finance`)

- **Location**: `/src/app/finance/page.tsx`
- Year selector with summary cards showing:
  - Gross Revenue
  - COGS
  - Operating Expenses
  - Net Profit (Revenue + COGS + Expenses)
  - Owner Draws
  - Owner Contributions
- Client-side computation from ledger data

### 2. Chart of Accounts

- **Component**: `AccountsManager`
- Grouped by account type (Revenue/COGS/Expense/Asset/Liability/Equity)
- CRUD operations with validation
- Active/inactive toggle
- Unique code enforcement

### 3. Vendors Management

- **Component**: `VendorsManager`
- Vendor types: Supplier, Subcontractor, Service, Other
- Search by name/email/phone
- Filter by vendor type
- Detail drawer showing recent transactions
- Tax ID tracking (last 4 digits for security)

### 4. General Ledger

- **Component**: `LedgerTable`
- Filter by:
  - Year
  - Account
  - Vendor
  - Search text (description/memo/reference)
- Color-coded amounts (positive/negative)
- Linked entities (invoice/receipt/project/client) badges
- Row click opens transaction detail drawer

### 5. Transaction Management

- **Component**: `TransactionDrawer`
- Smart amount sign suggestions based on account type
- Vendor autocomplete
- Multiple receipt/document attachments
- Fields:
  - Transaction date
  - Account (required)
  - Amount (required, in dollars converted to cents)
  - Description (required)
  - Memo
  - Reference number
  - Vendor
  - Project/Client links

### 6. Receipt/Document Upload

- **Component**: `ReceiptUploader`
- Multiple file upload (images/PDFs)
- Private storage with signed URLs (5-min expiry for preview)
- File path pattern: `{companyId}/{year}/receipts/{transactionId}/{timestamp}-{filename}`
- Document preview modal
- Delete capability

### 7. Asset Management

- **Component**: `AssetsManager`
- Track major purchases for CPA depreciation decisions
- Filter by status (Active/Sold/Disposed) and purchase year
- Optional transaction creation (automatic ledger entry)
- Fields:
  - Name, category, purchase date, price
  - Vendor link
  - Status tracking
  - Notes

## Component Structure

```
src/
├── app/
│   └── finance/
│       └── page.tsx                 # Main finance page with tabs
├── components/
│   ├── FinanceDashboard/           # Financial summary dashboard
│   ├── LedgerTable/                # General ledger view
│   ├── AccountsManager/            # Chart of accounts CRUD
│   ├── VendorsManager/             # Vendor management
│   ├── AssetsManager/              # Asset tracking
│   ├── TransactionDrawer/          # Transaction create/edit drawer
│   └── ReceiptUploader/            # Document upload component
└── services/
    ├── accountsApi.ts              # Accounts API calls
    ├── vendersApi.ts               # Vendors API calls
    ├── financialTransactionsApi.ts # Transactions API calls
    ├── financialDocumentsApi.ts    # Documents/receipts API calls
    └── assetsApi.ts                # Assets API calls
```

## Data Flow

### Creating a Transaction with Receipt

1. User opens TransactionDrawer
2. Selects account → system suggests sign (positive/negative)
3. Enters amount in dollars → converted to cents
4. Optionally uploads receipt via ReceiptUploader
5. Receipt uploaded to private storage → signed URL created
6. Transaction created with link to document
7. Ledger refreshed

### Asset Purchase Flow

1. User creates asset in AssetsManager
2. Optionally checks "Create matching transaction"
3. System creates:
   - Asset record
   - Financial transaction (negative amount, asset account)
   - Links transaction_id to asset
4. Both appear in respective lists

## API Usage Patterns

### List with Filters

```typescript
const { items, total } = await financialTransactionsApi.list({
  year: 2024,
  account_id: "account-uuid",
  vendor_id: "vendor-uuid",
  q: "search text",
  limit: 100,
});
```

### Create Transaction

```typescript
await financialTransactionsApi.create({
  transaction_date: "2024-01-15",
  account_id: "account-uuid",
  amount_cents: -50000, // $500 expense (negative)
  description: "Office supplies",
  vendor_id: "vendor-uuid",
  source: "manual",
  currency: "USD",
  company_id: "", // Set by RLS
});
```

### Upload Receipt

```typescript
await financialDocumentsApi.uploadAndCreate({
  file: fileBlob,
  file_name: "receipt.jpg",
  file_path: "company/2024/receipts/tx-id/123-receipt.jpg",
  document_type: "expense_receipt",
  transaction_id: "tx-uuid",
});
```

### Get Signed URL for Preview

```typescript
const url = await financialDocumentsApi.getSignedUrl(
  documentId,
  300, // 5 minutes
);
```

## Form Validation

All forms include:

- Required field validation
- Unique constraint handling (account codes)
- Error display with MUI Alert components
- Success notifications via Snackbar
- Loading states during mutations

## UX Features

### Empty States

- "No transactions yet" with call-to-action
- "No vendors found matching your filters"
- Filter-aware empty state messages

### Confirmation Dialogs

- Delete confirmations for destructive actions
- Warning about record dependencies

### Amount Display

- Positive amounts: green
- Negative amounts: red
- Currency formatting: $1,234.56
- Sign indicators in ledger

### Link Badges

- Invoice: INV badge
- Receipt: RCP badge
- Project: PRJ badge
- Client: CLT badge

## Future Enhancements

Potential additions:

- [ ] Reports (P&L, Balance Sheet)
- [ ] Multi-year comparisons
- [ ] Budget vs actual
- [ ] Tax report generation
- [ ] Bank reconciliation
- [ ] Recurring transactions
- [ ] Export to QuickBooks/Excel
- [ ] Multi-currency support
- [ ] Audit trail
- [ ] Approval workflows

## Security

- Multi-tenant isolation via RLS (Row Level Security)
- Private storage bucket for documents
- Signed URLs with short expiry (5 min)
- Company-scoped queries enforced by backend
- Input sanitization for file uploads

## Performance Considerations

- Client-side caching for accounts/vendors dropdowns
- Debounced search inputs
- Pagination support (limit/offset)
- Lazy loading of documents
- Year-based filtering to limit dataset size

## Testing Checklist

- [ ] Create/edit/delete accounts
- [ ] Create/edit/delete vendors
- [ ] Create transaction with receipt
- [ ] Delete transaction with document cleanup
- [ ] Create asset with transaction
- [ ] Filter ledger by year/account/vendor
- [ ] Upload multiple receipts
- [ ] Preview PDF and image receipts
- [ ] Signed URL expiration handling
- [ ] Empty state displays
- [ ] Error handling (network, validation)
- [ ] RLS enforcement (multi-tenant)

## Dependencies

- Next.js 15 (App Router)
- MUI v7 (Material-UI)
- Supabase (Database + Storage)
- TypeScript
- React 19

---

**Created**: 2026-02-16
**Last Updated**: 2026-02-16
