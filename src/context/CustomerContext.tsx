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

interface ClientContextType {
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

interface ClientProviderProps {
  children: ReactNode;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const pathname = usePathname();
  const [previousCustomers, setPreviousCustomers] = useState<Customer[]>([]);
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
    }
  };

  useEffect(() => {
    const customerId = getCustomerIdURL(window.location.href);
    getCustomerById(customerId);
  }, [pathname]);

  const value: ClientContextType = {
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

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
