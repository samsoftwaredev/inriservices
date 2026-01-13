import { ClientStatus } from "@/types";

export interface ClientFormData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addressId: string;
  address: string;
  address2?: string;
  contact: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfProjects: number;
  floorPlan: number;
  measurementUnit: string;
  totalRevenue: number;
  lastProjectDate: string;
  status: ClientStatus;
  notes?: string;
}