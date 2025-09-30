export interface LaborMaterial {
  quantity: number;
  unit: string;
  price: number;
}

export interface LaborTask {
  name: string;
  description?: string;
  hours: number;
  rate: number;
  amountOfLabor: number;
  laborMaterials?: LaborMaterial[];
}

export type RoomFeature = {
  id: string;
  dimensions: string;
  name?: string;
  description?: string;
  picture: string | null;
  workLabor?: LaborTask[];
};

export interface RoomData {
  ceilingArea: string;
  ceilingAreaCalculated: number;
  wallPerimeter: string;
  wallPerimeterCalculated: number;
  floorNumber?: number;
  roomHeight: number;
  features: {
    windows: RoomFeature[];
    doors: RoomFeature[];
    walls: RoomFeature[];
    closets: RoomFeature[];
    crownMolding: RoomFeature[];
    chairRail: RoomFeature[];
    baseboard: RoomFeature[];
    wainscoting: RoomFeature[];
  };
}

export interface Props {
  measurementUnit: string;
  floorNumber: number;
  id: string;
  roomName: string;
  roomDescription?: string;
  onRoomUpdate?: (updates: {
    id: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => void;
}

export type FeatureType = keyof RoomData["features"];

export type MeasurementUnit = "ft" | "m" | "in";

export interface Section {
  id: string;
  name: string;
  description: string;
  floorNumber: number;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LocationData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  measurementUnit: MeasurementUnit;
  floorPlan: number;
  sections: Section[];
}
