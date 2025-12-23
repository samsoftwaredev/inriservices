"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Customer } from "@/interfaces/laborTypes";

interface CustomerContextType {
  // State
  previousCustomers: Customer[];
  setPreviousCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  currentCustomer?: Customer;
  setCurrentCustomer: React.Dispatch<
    React.SetStateAction<Customer | undefined>
  >;

  // Handlers
  handleSelectPreviousCustomer: (customer: Customer) => void;
  handleSaveNewCustomer: (newCustomerData: Omit<Customer, "id">) => void;
  handleCustomerUpdate: (updatedCustomer: Customer) => void;
}

interface CustomerProviderProps {
  children: ReactNode;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    contact: "Jane Smith",
    phone: "(123) 456-7890",
    email: "jane.smith@example.com",
    buildings: [
      {
        address: "456 Oak St",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        measurementUnit: "ft",
        floorPlan: 2,
        sections: [
          {
            id: "1",
            name: "Living Room",
            description: "Spacious living area",
            floorNumber: 1,
          },
          {
            id: "2",
            name: "Kitchen",
            description: "Modern kitchen space",
            floorNumber: 1,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Alice Johnson",
    contact: "Bob Wilson",
    phone: "(555) 123-4567",
    email: "bob.wilson@email.com",
    buildings: [
      {
        address: "789 Pine St",
        city: "Metropolis",
        state: "NY",
        zipCode: "10001",
        measurementUnit: "ft",
        floorPlan: 3,
        sections: [],
      },
    ],
  },
  {
    id: "3",
    name: "Michael Brown",
    contact: "Sarah Brown",
    phone: "(333) 555-7777",
    email: "sarah.brown@gmail.com",
    buildings: [
      {
        address: "321 Cedar St",
        city: "Gotham",
        state: "NJ",
        zipCode: "07097",
        measurementUnit: "ft",
        floorPlan: 1,
        sections: [],
      },
    ],
  },
];

const DEFAULT_CUSTOMER: Customer = {
  id: "1",
  name: "John Doe",
  contact: "Jane Smith",
  phone: "(123) 456-7890",
  email: "jane.smith@example.com",
  buildings: [
    {
      address: "456 Oak St",
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      measurementUnit: "ft",
      floorPlan: 2,
      sections: [],
    },
  ],
};

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  // State
  const [previousCustomers, setPreviousCustomers] =
    useState<Customer[]>(INITIAL_CUSTOMERS);
  const [currentCustomer, setCurrentCustomer] = useState<
    Customer | undefined
  >();

  const handleSelectPreviousCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    localStorage.setItem("currentCustomerId", customer.id);
  };

  const handleSaveNewCustomer = (newCustomerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: Date.now().toString(),
    };

    setCurrentCustomer(newCustomer);
    localStorage.setItem("currentCustomerId", newCustomer.id);
    setPreviousCustomers((prev) => [...prev, newCustomer]);
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCurrentCustomer(updatedCustomer);
    setPreviousCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const value: CustomerContextType = {
    // State
    previousCustomers,
    setPreviousCustomers,
    currentCustomer,
    setCurrentCustomer,

    // Handlers
    handleSelectPreviousCustomer,
    handleSaveNewCustomer,
    handleCustomerUpdate,
  };

  return React.createElement(CustomerContext.Provider, { value }, children);
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};

/**
 * Get customer by ID
 */
export const useCustomerById = (customerId: string) => {
  const { previousCustomers, currentCustomer } = useCustomer();

  if (currentCustomer?.id === customerId) {
    return currentCustomer;
  }

  return (
    previousCustomers.find((customer) => customer.id === customerId) || null
  );
};

/**
 * Check if customer exists
 */
export const useCustomerExists = (customerEmail: string) => {
  const { previousCustomers } = useCustomer();

  return previousCustomers.some(
    (customer) => customer.email.toLowerCase() === customerEmail.toLowerCase()
  );
};

/**
 * Search customers by name or email
 */
export const useCustomerSearch = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
