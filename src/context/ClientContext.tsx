"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { clientApi, propertyApi } from "@/services";
import { toast } from "react-toastify";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";
import { ClientFullData, PropertyTransformed } from "@/types";
import { clientFullDataTransformer } from "@/tools/transformers";

interface ClientContextType {
  // State
  previousClientIds: string[];
  allClients: ClientFullData[];
  currentClient?: ClientFullData;
  // Handlers
  handleSelectClient: (clientId: string) => void;
  handleCreateNewClient: (
    data: ClientFormData,
    companyId: string
  ) => Promise<void>;
  handleCreateNewProperty: (
    data: ClientFormData,
    companyId: string
  ) => Promise<void>;

  propertyData?: PropertyTransformed;
  setPropertyData: React.Dispatch<
    React.SetStateAction<PropertyTransformed | undefined>
  >;
}

interface ClientProviderProps {
  children: ReactNode;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const pathname = usePathname();
  const [previousClientIds, setPreviousClientIds] = useState<string[]>([]);
  const [allClients, setAllClients] = useState<ClientFullData[]>([]);
  const [currentClient, setCurrentClient] = useState<
    ClientFullData | undefined
  >();
  const [propertyData, setPropertyData] = useState<
    PropertyTransformed | undefined
  >();

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

  const handleSelectClient = (clientId: string) => {
    const client = allClients.find((client) => client.id === clientId);
    if (client) {
      setCurrentClient(client);
      updateLocalStorage(client.id);
      setPropertyData(client.properties[0]);
    }
    setPreviousClientIds((prevIds) => {
      const filtered = prevIds.filter((id) => id !== clientId);
      // max 5 previous clients
      if (filtered.length >= 5) filtered.pop();
      return [clientId, ...filtered];
    });
  };

  function getCustomerIdURL(url: string): string | undefined {
    const id = new URL(url).pathname.split("/").pop();
    if (!id) return undefined;
    return id;
  }

  const getCustomerById = (clientId?: string) => {
    const client = allClients.find((client) => client.id === clientId);
    if (client) {
      setCurrentClient(client);
      updateLocalStorage(client.id);
      setPropertyData(client.properties[0]);
    }
  };

  const getClients = async () => {
    const clientRes = await clientApi.listClientsWithAddresses();
    const transformed = clientRes.items.map((client) =>
      clientFullDataTransformer(client)
    );
    setAllClients(transformed);
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    const clientId = getCustomerIdURL(window.location.href);
    getCustomerById(clientId);
  }, [pathname]);

  const value: ClientContextType = {
    // State
    previousClientIds,
    allClients,
    currentClient,
    // Handlers
    handleSelectClient,
    handleCreateNewClient,
    handleCreateNewProperty,

    propertyData,
    setPropertyData,
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
