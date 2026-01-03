"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ClientData, LocationData } from "@/interfaces/laborTypes";
import { uuidv4 } from "@/tools";
import { usePathname } from "next/navigation";

interface ClientContextType {
  // State
  previousClient: ClientData[];
  setPreviousClient: React.Dispatch<React.SetStateAction<ClientData[]>>;
  currentClient?: ClientData;
  setCurrentClient: React.Dispatch<
    React.SetStateAction<ClientData | undefined>
  >;

  // Handlers
  handleSelectPreviousClient: (customer: ClientData) => void;
  handleSaveNewClient: (newCustomerData: Omit<ClientData, "id">) => void;
  handleClientUpdate: (updatedCustomer: ClientData) => void;

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
  const [previousClient, setPreviousClient] = useState<ClientData[]>([]);
  const [currentClient, setCurrentClient] = useState<ClientData | undefined>();
  const [buildingData, setBuildingData] = useState<LocationData | undefined>();

  const updateLocalStorage = (customerId?: string) => {
    if (customerId) {
      localStorage.setItem("currentCustomerId", customerId);
    } else {
      localStorage.removeItem("currentCustomerId");
    }
  };

  const handleSelectPreviousClient = (customer: ClientData) => {
    updateLocalStorage(customer.id);
  };

  const handleSaveNewClient = (newCustomerData: Omit<ClientData, "id">) => {
    const newCustomer: ClientData = {
      ...newCustomerData,
      id: uuidv4(),
    };

    setCurrentClient(newCustomer);
    updateLocalStorage(newCustomer.id);
    setPreviousClient((prev) => [...prev, newCustomer]);
  };

  const handleClientUpdate = (updatedCustomer: ClientData) => {
    setCurrentClient(updatedCustomer);
    setPreviousClient((prev) =>
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
    const customer = previousClient.find((cust) => cust.id === customerId);
    if (customer) {
      setCurrentClient(customer);
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
    previousClient,
    setPreviousClient,
    currentClient,
    setCurrentClient,

    // Handlers
    handleSelectPreviousClient,
    handleSaveNewClient,
    handleClientUpdate,

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
