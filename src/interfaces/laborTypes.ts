export interface LaborMaterial {
  description?: string;
  name?: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface TaskHours {
  [taskName: string]: number;
}

export interface LaborTask {
  name: string;
  description?: string;
  hours: number;
  rate: number;
  amountOfLabor: number;
  laborMaterials?: LaborMaterial[];
}

type chairRailDimensions = {
  chairRailPerimeter: string;
  chairRailHeight: number;
  chairRailPaintCoats?: number;
};

type crownMoldingDimensions = {
  crownMoldingPerimeter: string;
  crownMoldingHeight: number;
  crownMoldingPaintCoats?: number;
};

type BaseboardDimensions = {
  baseboardPerimeter: string;
  baseboardHeight: number;
  baseboardPaintCoats?: number;
};

type WallDimensions = {
  wallPerimeter: string;
  roomHeight: number;
  wallPaintCoats?: number;
};

export type RoomDimensionsOverview = {
  area: string;
  roomName: string;
  roomDescription?: string;
  floorNumber?: number;
} & WallDimensions &
  BaseboardDimensions &
  chairRailDimensions &
  crownMoldingDimensions;

export type RoomFeature = {
  id: string;
  type: string;
  dimensions: string;
  name?: string;
  description?: string;
  picture: string | null;
  includeMaterialCosts?: boolean;
  workLabor?: LaborTask[];
};

export type RoomData = {
  area: string;
  areaCalculated: number;
  totalCost: number;
  wallPerimeterCalculated: number;
  baseboardPerimeterCalculated: number;
  chairRailPerimeterCalculated: number;
  crownMoldingPerimeterCalculated: number;
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
} & WallDimensions &
  BaseboardDimensions &
  chairRailDimensions &
  crownMoldingDimensions;

export interface Props {
  measurementUnit: MeasurementUnit;
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
