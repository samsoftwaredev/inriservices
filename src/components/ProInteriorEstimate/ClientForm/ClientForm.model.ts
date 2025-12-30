import { MeasurementUnit } from "@/interfaces/laborTypes";

export interface ClientFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerContact: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  measurementUnit: MeasurementUnit;
  floorPlan: number;
}

export interface ClientInitData {
    id: string;
    name: string;
    email: string;
    phone: string;
    contact: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    measurementUnit: MeasurementUnit;
    floorPlan: number;
}