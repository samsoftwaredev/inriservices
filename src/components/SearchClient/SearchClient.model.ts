import { ClientStatus } from "@/services";

export interface ClientInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfProjects: number;
  totalRevenue: number;
  lastProjectDate: string;
  status: ClientStatus;
  notes?: string;
}