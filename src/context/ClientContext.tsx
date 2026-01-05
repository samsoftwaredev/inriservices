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
import { clientApi, propertyApi } from "@/services";
import { toast } from "react-toastify";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";

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
  handleCreateNewClient: (
    data: ClientFormData,
    companyId: string
  ) => Promise<void>;
  handleCreateNewProperty: (
    data: ClientFormData,
    companyId: string
  ) => Promise<void>;

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

  const handleCreateNewClient = async (
    data: ClientFormData,
    companyId: string
  ) => {
    try {
      await clientApi.createClient({
        client_type: "person",
        display_name: data.fullName,
        primary_email: data.email,
        primary_phone: data.phone,
        status: data.status,
        company_id: companyId, // Replace with actual company ID
        notes: "",
      });
      await propertyApi.createProperty({
        client_id: data.id,
        address_line1: data.address,
        address_line2: data.address2 || "",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
        company_id: companyId, // Replace with actual company ID
        name: `${data.fullName}'s Property`,
        property_type: "residential",
        country: "USA",
      });
      toast.success("New client created successfully.");
    } catch (error) {
      console.error("Error creating new client:", error);
      toast.error("Failed to create new client.");
    }
  };

  const handleCreateNewProperty = async (
    data: ClientFormData,
    companyId: string
  ) => {
    try {
      await propertyApi.createProperty({
        client_id: data.id,
        address_line1: data.address,
        address_line2: data.address2 || "",
        city: data.city,
        state: data.state,
        zip: data.zipCode,
        company_id: companyId, // Replace with actual company ID
        name: `${data.fullName}'s Property`,
        property_type: "residential",
        country: "USA",
      });
      toast.success("New client created successfully.");
    } catch (error) {
      console.error("Error creating new client:", error);
      toast.error("Failed to create new client.");
    }
  };

  const updateLocalStorage = (clientId?: string) => {
    if (clientId) {
      localStorage.setItem("currentClientId", clientId);
    } else {
      localStorage.removeItem("currentClientId");
    }
  };

  const handleSelectPreviousClient = (client: ClientData) => {
    updateLocalStorage(client.id);
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

  const handleClientUpdate = (updatedClient: ClientData) => {
    setCurrentClient(updatedClient);
    setPreviousClient((prev) =>
      prev.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  function getCustomerIdURL(url: string): string | undefined {
    const id = new URL(url).pathname.split("/").pop();
    if (!id) return undefined;
    return id;
  }

  const getCustomerById = (clientId?: string) => {
    const client = previousClient.find((client) => client.id === clientId);
    if (client) {
      setCurrentClient(client);
      updateLocalStorage(client.id);
      setBuildingData(client.buildings[0]);
    }
  };

  useEffect(() => {
    const clientId = getCustomerIdURL(window.location.href);
    getCustomerById(clientId);
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
    handleCreateNewClient,
    handleCreateNewProperty,

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
