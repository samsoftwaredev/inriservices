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
