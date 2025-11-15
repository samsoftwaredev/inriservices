import { useState } from "react";
import { Customer } from "../interfaces/laborTypes";

export const useCustomerManagement = () => {
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

  const handleSelectPreviousCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
  };

  const handleSaveNewCustomer = (newCustomerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: Date.now().toString(),
    };

    setCurrentCustomer(newCustomer);
    setPreviousCustomers([...previousCustomers, newCustomer]);
    return newCustomer;
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCurrentCustomer(updatedCustomer);
    setPreviousCustomers(
      previousCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    return updatedCustomer;
  };

  return {
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
};
