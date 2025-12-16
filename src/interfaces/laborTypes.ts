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

export enum PaintBaseType {
  OilBased = "oil-based",
  WaterBased = "water-based",
  Latex = "latex",
  Acrylic = "acrylic",
}

export type LaborTaskCostSummary = {
  name: string;
  hours: number;
  laborCost: number;
  materialCost: number;
  totalCost: number;
} | null;

type WainscotingDimensions = {
  wainscotingPerimeter: string;
  wainscotingHeight: number;
  wainscotingPaintCoats?: number;
  wainscotingPaintBase?: PaintBaseType;
};

type ChairRailDimensions = {
  chairRailPerimeter: string;
  chairRailHeight: number;
  chairRailPaintCoats?: number;
  chairRailPaintBase?: PaintBaseType;
};

type CrownMoldingDimensions = {
  crownMoldingPerimeter: string;
  crownMoldingHeight: number;
  crownMoldingPaintCoats?: number;
  crownMoldingPaintBase?: PaintBaseType;
};

type BaseboardDimensions = {
  baseboardPerimeter: string;
  baseboardHeight: number;
  baseboardPaintCoats?: number;
  baseboardPaintBase?: PaintBaseType;
};

type WallDimensions = {
  wallPerimeter: string;
  roomHeight: number;
  wallPaintCoats?: number;
  wallPaintBase?: PaintBaseType;
};

type FloorDimensions = {
  floorPaintCoats?: number;
  floorPaintBase?: PaintBaseType;
};

type CeilingDimensions = {
  ceilingPaintCoats?: number;
  ceilingPaintBase?: PaintBaseType;
};

export type RoomDimensionsOverview = {
  area: string;
  roomName: string;
  roomDescription?: string;
  floorNumber?: number;
} & WallDimensions &
  BaseboardDimensions &
  ChairRailDimensions &
  CrownMoldingDimensions &
  WainscotingDimensions &
  FloorDimensions &
  CeilingDimensions;

export type RoomFeature = {
  id: string;
  type: string;
  dimensions: string;
  image: string;
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
  wainscotingPerimeterCalculated: number;
  floorNumber?: number;
  roomHeight: number;
  features: {
    ceilings: RoomFeature[];
    flooring: RoomFeature[];
    cabinetry: RoomFeature[];
    outlets: RoomFeature[];
    switches: RoomFeature[];
    fixtures: RoomFeature[];
    trim: RoomFeature[];
    windows: RoomFeature[];
    doors: RoomFeature[];
    walls: RoomFeature[];
    closets: RoomFeature[];
    crownMolding: RoomFeature[];
    chairRail: RoomFeature[];
    baseboard: RoomFeature[];
    wainscoting: RoomFeature[];
    other: RoomFeature[];
  };
} & WallDimensions &
  BaseboardDimensions &
  ChairRailDimensions &
  CrownMoldingDimensions &
  WainscotingDimensions &
  FloorDimensions &
  CeilingDimensions;

export interface Props {
  onRoomUpdate?: (updates: {
    roomId: string;
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

export interface CustomerAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export type LocationData = {
  measurementUnit: MeasurementUnit;
  floorPlan: number;
  sections: Section[];
} & CustomerAddress;

export type Customer = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  buildings: LocationData[];
};

export type FeatureDetails = {
  coats: number | null;
  perimeter: number | null;
  paintBase: PaintBaseType | null;
};

export type RoomCollection = {
  [key: string]: FeatureDetails;
};

export interface DiscountConfig {
  type: "percentage" | "amount";
  value: number;
  isEditing: boolean;
}

export interface CostCalculation {
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
  profitAmount: number;
  totalWithProfit: number;
  taxesToPay: number;
  paymentSystemFee: number;
  companyFeesTotal: number;
  totalWithTaxes: number;
}

export interface TaskBreakdownItem {
  name: string;
  hours: number;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  roomId?: string;
  featureId?: string;
  featureType?: string;
}

export type LaborCostData = {
  totalCost: number;
  totalLaborCost: number;
  totalMaterialCost: number;
  taskBreakdown: TaskBreakdownItem[];
};
