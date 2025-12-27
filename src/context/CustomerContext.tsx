"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Customer, LocationData } from "@/interfaces/laborTypes";
import { uuidv4 } from "@/tools";
import { usePathname } from "next/navigation";

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

  buildingData?: LocationData;
  setBuildingData: React.Dispatch<
    React.SetStateAction<LocationData | undefined>
  >;
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
        id: "1",
        address: "456 Oak St",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        measurementUnit: "ft",
        floorPlan: 2,
        rooms: [],
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
        id: "2",
        address: "789 Pine St",
        city: "Metropolis",
        state: "NY",
        zipCode: "10001",
        measurementUnit: "ft",
        floorPlan: 3,
        rooms: [],
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
        id: "3",
        address: "321 Cedar St",
        city: "Gotham",
        state: "NJ",
        zipCode: "07097",
        measurementUnit: "ft",
        floorPlan: 1,
        rooms: [],
      },
    ],
  },
];

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const pathname = usePathname();
  const [previousCustomers, setPreviousCustomers] =
    useState<Customer[]>(INITIAL_CUSTOMERS);
  const [currentCustomer, setCurrentCustomer] = useState<
    Customer | undefined
  >();
  const [buildingData, setBuildingData] = useState<LocationData | undefined>();

  const updateLocalStorage = (customerId?: string) => {
    if (customerId) {
      localStorage.setItem("currentCustomerId", customerId);
    } else {
      localStorage.removeItem("currentCustomerId");
    }
  };

  const handleSelectPreviousCustomer = (customer: Customer) => {
    updateLocalStorage(customer.id);
  };

  const handleSaveNewCustomer = (newCustomerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: uuidv4(),
    };

    setCurrentCustomer(newCustomer);
    updateLocalStorage(newCustomer.id);
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

  function getCustomerIdURL(url: string): string | undefined {
    const id = new URL(url).pathname.split("/").pop();
    if (!id) return undefined;
    return id;
  }

  const getCustomerById = (customerId?: string) => {
    const customer = previousCustomers.find((cust) => cust.id === customerId);
    if (customer) {
      setCurrentCustomer(customer);
      updateLocalStorage(customer.id);
      setBuildingData(customer.buildings[0]);
    } else {
      setCurrentCustomer(undefined);
      updateLocalStorage();
      setBuildingData(undefined);
    }
  };

  useEffect(() => {
    const customerId = getCustomerIdURL(window.location.href);
    getCustomerById(customerId);
  }, [pathname]);

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

    buildingData,
    setBuildingData,
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
