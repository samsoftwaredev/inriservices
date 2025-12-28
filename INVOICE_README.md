# Invoice PDF Generator

A comprehensive invoice generator built with React PDF for the InriPaintWall application. This component allows users to create professional PDF invoices from estimate data with a single click.

## Features

- **Professional PDF Generation**: Creates high-quality PDF invoices using @react-pdf/renderer
- **Customizable Invoice Data**: Supports customer information, line items, tax calculations, and notes
- **Real-time Preview**: Interactive preview of invoice data before PDF generation
- **Material-UI Integration**: Seamless integration with the existing MUI design system
- **Responsive Design**: Works across all device sizes
- **TypeScript Support**: Fully typed interfaces for better development experience

## Installation

The following packages are required for PDF generation:

```bash
npm install @react-pdf/renderer
npm install --save-dev @types/react-pdf
```

## Components

### InvoiceGenerator

The main component that provides a download button for PDF generation.

```tsx
import { InvoiceGenerator, InvoiceData } from '@/components';

const invoiceData: InvoiceData = {
  invoiceNumber: 'INV-001',
  date: '12/28/2025',
  dueDate: '01/27/2026',
  customer: {
    name: 'John Smith',
    email: 'john@example.com',
    address: '123 Main St',
    city: 'Garland',
    state: 'TX',
    zipCode: '75040'
  },
  items: [
    {
      id: '1',
      description: 'Living Room - Interior Painting',
      quantity: 1,
      rate: 650,
      amount: 650
    }
  ],
  subtotal: 650,
  tax: 53.63,
  taxRate: 0.0825,
  total: 703.63,
  notes: 'Thank you for your business!'
};

<InvoiceGenerator
  invoiceData={invoiceData}
  buttonText="Download Invoice"
  variant="contained"
/>
```

### InvoiceDemo

An interactive demo component that allows users to create and customize invoices.

```tsx
import { InvoiceDemo } from '@/components';

// Use as a standalone page or component
<InvoiceDemo />
```

## Props

### InvoiceGenerator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `invoiceData` | `InvoiceData` | Required | Complete invoice data object |
| `buttonText` | `string` | 'Download Invoice' | Text displayed on the button |
| `fileName` | `string` | Auto-generated | Custom filename for the PDF |
| `variant` | `'contained' | 'outlined' | 'text'` | 'contained' | Material-UI button variant |
| `size` | `'small' | 'medium' | 'large'` | 'medium' | Button size |
| `fullWidth` | `boolean` | false | Whether button takes full width |

## Types

### InvoiceData

```typescript
interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
}
```

### InvoiceItem

```typescript
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
```

### Customer

```typescript
interface Customer {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}
```

## Utility Functions

### generateInvoiceFromEstimate

Converts estimate data into invoice format:

```typescript
import { generateInvoiceFromEstimate } from '@/tools/invoiceUtils';

const estimateData = {
  rooms: [
    {
      id: '1',
      name: 'Living Room',
      description: 'Interior painting',
      cost: 650
    }
  ],
  customer: {
    name: 'John Smith',
    email: 'john@example.com'
  }
};

const invoiceData = generateInvoiceFromEstimate(estimateData);
```

### generateSampleInvoice

Creates a sample invoice for demo purposes:

```typescript
import { generateSampleInvoice } from '@/tools/invoiceUtils';

const sampleInvoice = generateSampleInvoice();
```

### formatInvoiceCurrency

Formats numbers as currency:

```typescript
import { formatInvoiceCurrency } from '@/tools/invoiceUtils';

const formatted = formatInvoiceCurrency(650); // "$650.00"
```

## Usage Examples

### Basic Usage

```tsx
import { InvoiceGenerator } from '@/components';

function MyComponent() {
  const handleDownload = () => {
    const invoiceData = {
      // ... invoice data
    };
    
    return (
      <InvoiceGenerator 
        invoiceData={invoiceData}
        buttonText="Download PDF"
        variant="outlined"
      />
    );
  };
}
```

### With Estimate Integration

```tsx
import { InvoiceGenerator } from '@/components';
import { generateInvoiceFromEstimate } from '@/tools/invoiceUtils';

function EstimatePage() {
  const estimateData = {
    rooms: [...], // Room data
    customer: {...}, // Customer info
  };
  
  const invoiceData = generateInvoiceFromEstimate(estimateData);
  
  return (
    <InvoiceGenerator 
      invoiceData={invoiceData}
      buttonText="Generate Invoice PDF"
    />
  );
}
```

### Custom Styling

```tsx
<InvoiceGenerator
  invoiceData={invoiceData}
  buttonText="Download Invoice"
  variant="contained"
  size="large"
  fullWidth
  fileName="custom-invoice-name.pdf"
/>
```

## PDF Features

The generated PDF includes:

- Professional company branding
- Customer information section
- Itemized services with quantities and rates
- Automatic tax calculations (Texas 8.25% rate)
- Subtotal, tax, and total amounts
- Invoice notes and terms
- Professional footer with payment terms

## Customization

### Company Information

The PDF uses hardcoded company information for InriPaintWall. To customize:

1. Edit the PDF component in `InvoiceGenerator.tsx`
2. Update the company details in the header section
3. Modify styling in the `styles` object

### Tax Rates

Tax calculations use Texas sales tax (8.25%). To modify:

```typescript
// In invoiceUtils.ts
export const calculateTax = (subtotal: number, taxRate: number = 0.0875): number => {
  return subtotal * taxRate;
};
```

## Testing

The invoice functionality can be tested at:
- `/invoice-demo` - Interactive demo page
- `/general-estimate` - Integrated with estimate functionality

## Browser Compatibility

The PDF generation works in all modern browsers that support:
- File download APIs
- Canvas/SVG rendering
- Modern JavaScript features

## Performance

- PDF generation is client-side and fast
- No server requests required for PDF creation
- Optimized for mobile devices
- Lazy loading of PDF library components

## Troubleshooting

### Common Issues

1. **PDF not downloading**: Check browser popup settings
2. **Styling issues**: Verify @react-pdf/renderer styles
3. **Missing data**: Ensure all required InvoiceData fields are provided

### Debug Mode

Enable debug mode by checking browser console for PDF generation errors.