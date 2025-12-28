import { InvoiceData, InvoiceItem, Customer } from '@/components/InvoiceGenerator';

interface EstimateRoom {
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

interface EstimateData {
  rooms: EstimateRoom[];
  customer?: Partial<Customer>;
  projectName?: string;
  notes?: string;
}

/**
 * Generates invoice data from estimate information
 */
export const generateInvoiceFromEstimate = (estimateData: EstimateData): InvoiceData => {
  const { rooms, customer, projectName, notes } = estimateData;
  
  // Generate invoice items from rooms
  const items: InvoiceItem[] = rooms.map((room) => {
    let roomCost = room.cost || 0;
    
    // Add feature costs if available
    if (room.features && room.features.length > 0) {
      roomCost = room.features.reduce((total, feature) => total + feature.cost, 0);
    }
    
    // Default cost if no cost provided
    if (roomCost === 0) {
      roomCost = 450; // Default room painting cost
    }
    
    return {
      id: room.id,
      description: `${room.name} - ${room.description || 'Interior Painting & Preparation'}`,
      quantity: 1,
      rate: roomCost,
      amount: roomCost,
    };
  });
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.0825; // Texas sales tax rate (8.25%)
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // Generate invoice number
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  
  // Current date and due date (30 days from now)
  const currentDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(currentDate.getDate() + 30);
  
  // Default customer info if not provided
  const defaultCustomer: Customer = {
    name: customer?.name || 'Valued Customer',
    email: customer?.email || 'customer@email.com',
    address: customer?.address || '123 Main Street',
    city: customer?.city || 'Garland',
    state: customer?.state || 'TX',
    zipCode: customer?.zipCode || '75040',
  };
  
  // Merge with provided customer data
  const invoiceCustomer: Customer = {
    ...defaultCustomer,
    ...customer,
  };
  
  // Default notes
  const defaultNotes = notes || 
    'Thank you for choosing InriPaintWall for your painting needs! ' +
    'All work includes premium materials and professional preparation. ' +
    'Payment is due within 30 days of invoice date. ' +
    'Please contact us with any questions about your project.';
  
  return {
    invoiceNumber,
    date: currentDate.toLocaleDateString(),
    dueDate: dueDate.toLocaleDateString(),
    customer: invoiceCustomer,
    items,
    subtotal,
    tax,
    taxRate,
    total,
    notes: defaultNotes,
  };
};

/**
 * Generates a sample invoice for demonstration purposes
 */
export const generateSampleInvoice = (): InvoiceData => {
  const sampleEstimate: EstimateData = {
    rooms: [
      {
        id: '1',
        name: 'Living Room',
        description: 'Interior painting with primer and two coats',
        cost: 650,
      },
      {
        id: '2',
        name: 'Master Bedroom',
        description: 'Interior painting and ceiling touch-up',
        cost: 450,
      },
      {
        id: '3',
        name: 'Kitchen',
        description: 'Cabinet painting and wall refresh',
        cost: 800,
      },
    ],
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      address: '456 Oak Street',
      city: 'Garland',
      state: 'TX',
      zipCode: '75041',
    },
    projectName: 'Whole House Interior Refresh',
    notes: 'Customer requested eco-friendly paint. All furniture will be covered and protected during work.',
  };
  
  return generateInvoiceFromEstimate(sampleEstimate);
};

/**
 * Format currency for invoice display
 */
export const formatInvoiceCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Calculate tax amount
 */
export const calculateTax = (subtotal: number, taxRate: number = 0.0825): number => {
  return subtotal * taxRate;
};

/**
 * Generate unique invoice number
 */
export const generateInvoiceNumber = (prefix: string = 'INV'): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp.slice(-6)}-${random}`;
};