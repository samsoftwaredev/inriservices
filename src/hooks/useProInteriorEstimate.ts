import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Customer,
  LocationData,
  Section,
} from "../components/ProInteriorEstimate/laborTypes";

interface DeleteConfirmationState {
  open: boolean;
  sectionId: string | null;
  sectionName: string | null;
}

export const useProInteriorEstimate = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sample previous customers data
  const [previousCustomers, setPreviousCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      contact: "Jane Smith",
      phone: "(123) 456-7890",
      email: "jane.smith@example.com",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
    {
      id: "2",
      name: "Alice Johnson",
      contact: "Bob Wilson",
      phone: "(555) 123-4567",
      email: "bob.wilson@email.com",
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "TX",
      zipCode: "67890",
    },
    {
      id: "3",
      name: "Michael Brown",
      contact: "Sarah Brown",
      phone: "(333) 555-7777",
      email: "sarah.brown@gmail.com",
      address: "789 Pine Street",
      city: "Riverside",
      state: "FL",
      zipCode: "54321",
    },
  ]);

  const [currentCustomer, setCurrentCustomer] = useState<Customer>({
    id: "1",
    name: "John Doe",
    contact: "Jane Smith",
    phone: "(123) 456-7890",
    email: "jane.smith@example.com",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
  });

  const [locationData, setLocationData] = useState<LocationData>({
    address: "123 Main St",
    city: "Garland",
    state: "TX",
    zipCode: "75040",
    measurementUnit: "ft",
    floorPlan: 1,
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
        description: "Modern kitchen area",
        floorNumber: 1,
      },
    ],
  });

  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      sectionId: null,
      sectionName: null,
    });

  const [baseCost, setBaseCost] = useState(1000);

  // Event handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    router.push("/dashboard");
  };

  const handleSelectPreviousCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setLocationData({
      ...locationData,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
    });
    setAnchorEl(null);
  };

  const handleSaveNewCustomer = (newCustomerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: Date.now().toString(),
    };

    setCurrentCustomer(newCustomer);
    setPreviousCustomers([...previousCustomers, newCustomer]);
    setLocationData({
      ...locationData,
      address: newCustomer.address,
      city: newCustomer.city,
      state: newCustomer.state,
      zipCode: newCustomer.zipCode,
    });
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCurrentCustomer(updatedCustomer);
    setPreviousCustomers(
      previousCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    setLocationData({
      ...locationData,
      address: updatedCustomer.address,
      city: updatedCustomer.city,
      state: updatedCustomer.state,
      zipCode: updatedCustomer.zipCode,
    });
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Room ${locationData.sections.length + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setLocationData({
      ...locationData,
      sections: [...locationData.sections, newSection],
    });
  };

  const handleDeleteSectionClick = (sectionId: string, sectionName: string) => {
    setDeleteConfirmation({
      open: true,
      sectionId,
      sectionName,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      open: false,
      sectionId: null,
      sectionName: null,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.sectionId) {
      setLocationData({
        ...locationData,
        sections: locationData.sections.filter(
          (section) => section.id !== deleteConfirmation.sectionId
        ),
      });
    }
    handleDeleteCancel();
  };

  const onRoomUpdate = (updates: {
    id: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => {
    setLocationData((prevData) => {
      const updatedSections = prevData.sections.map((section) =>
        section.id === updates.id
          ? {
              ...section,
              name: updates.roomName,
              description: updates.roomDescription,
              floorNumber: updates.floorNumber,
            }
          : section
      );
      return {
        ...prevData,
        sections: updatedSections,
      };
    });
  };

  const handleCostChange = (newBaseCost: number) => {
    // setBaseCost(newBaseCost);
  };

  return {
    // State
    mobileOpen,
    setMobileOpen,
    previousCustomers,
    setPreviousCustomers,
    currentCustomer,
    setCurrentCustomer,
    locationData,
    setLocationData,
    anchorEl,
    setAnchorEl,
    newCustomerDialogOpen,
    setNewCustomerDialogOpen,
    deleteConfirmation,
    setDeleteConfirmation,
    baseCost,

    // Handlers
    handleDrawerToggle,
    handleNavigation,
    handleLogoClick,
    handleSelectPreviousCustomer,
    handleSaveNewCustomer,
    handleCustomerUpdate,
    addNewSection,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
    handleCostChange,
  };
};
