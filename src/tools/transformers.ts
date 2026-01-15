import { ClientWithRelations } from "@/services/clientApi";
import {
  Client,
  ClientFullData,
  ClientTransformed,
  Company,
  CompanyTransformed,
  Profile,
  ProfileTransformed,
  Project,
  ProjectFullData,
  ProjectStatus,
  ProjectTransformed,
  ProjectType,
  ProjectWithRelationsAndRooms,
  Property,
  PropertyRoom,
  PropertyRoomTransformed,
  PropertyTransformed,
} from "@/types";

export const projectStatusTransformer = (status: string): string => {
  switch (status) {
    case "draft":
      return "Draft";
    case "scheduled":
      return "Scheduled";
    case "in_progress":
      return "In Progress";
    case "on_hold":
      return "On Hold";
    case "completed":
      return "Completed";
    case "canceled":
      return "Canceled";
    default:
      return status;
  }
};

export const projectTypeTransformer = (type: string): string => {
  switch (type) {
    case "interior_paint":
      return "Interior Paint";
    case "exterior_paint":
      return "Exterior Paint";
    case "drywall_repair":
      return "Drywall Repair";
    case "trim_paint":
      return "Trim Paint";
    case "cabinet_paint":
      return "Cabinet Paint";
    case "wallpaper":
      return "Wallpaper";
    case "other":
      return "Other";
    default:
      return type;
  }
};

const transformSingleClient = (client: Client): ClientTransformed => ({
  id: client.id,
  displayName: client.display_name,
  email: client.normalized_email || "",
  phone: client.normalized_phone || "",
  status: client.status,
  notes: client.notes || "",
  companyId: client.company_id,
  createdAt: new Date(client.created_at).toISOString(),
  clientType: client.client_type,
});

export const allClientTransformer = (res: Client[]): ClientTransformed[] => {
  return res.map(transformSingleClient);
};

export const clientTransformer = (res: Client): ClientTransformed => {
  return transformSingleClient(res);
};

export const reversedProjectTransformer = (
  project: ProjectTransformed
): Project => ({
  id: project.id,
  company_id: project.companyId,
  client_id: project.clientId,
  property_id: project.propertyId,
  name: project.name,
  project_type: project.projectType as ProjectType,
  status: project.status as ProjectStatus,
  start_date: project.startDate,
  end_date: project.endDate,
  scope_notes: project.scopeNotes,
  material_cost_cents: project.materialCostCents,
  labor_cost_cents: project.laborCostCents,
  markup_bps: project.markupBps,
  tax_rate_bps: project.taxRateBps,
  tax_amount_cents: project.taxAmountCents,
  labor_hours_estimated: project.laborHoursEstimated,
  created_at: new Date(project.createdAt).toISOString(),
  updated_at: new Date(project.updatedAt).toISOString(),
  invoice_total_cents: project.invoiceTotalCents,
});

const transformSingleProject = (project: Project): ProjectTransformed => ({
  id: project.id,
  companyId: project.company_id,
  clientId: project.client_id,
  propertyId: project.property_id,
  name: project.name,
  projectType: project.project_type,
  status: project.status,
  startDate: project.start_date,
  endDate: project.end_date,
  scopeNotes: project.scope_notes || "",
  materialCostCents: project.material_cost_cents,
  laborCostCents: project.labor_cost_cents,
  markupBps: project.markup_bps,
  taxRateBps: project.tax_rate_bps,
  taxAmountCents: project.tax_amount_cents,
  laborHoursEstimated: project.labor_hours_estimated || 0,
  createdAt: new Date(project.created_at).toISOString(),
  updatedAt: new Date(project.updated_at).toISOString(),
  invoiceTotalCents: project.invoice_total_cents || 0,
});

export const projectTransformer = (res: Project): ProjectTransformed => {
  return transformSingleProject(res);
};

export const allProjectTransformer = (res: Project[]): ProjectTransformed[] => {
  return res.map(transformSingleProject);
};

const transformSingleRoom = (room: PropertyRoom): PropertyRoomTransformed => ({
  id: room.id,
  name: room.name,
  level: room.level,
  companyId: room.company_id,
  createdAt: new Date(room.created_at).toISOString(),
  paintTrim: room.paint_trim,
  projectId: room.project_id,
  sortOrder: room.sort_order,
  updatedAt: new Date(room.updated_at).toISOString(),
  description: room.description || "",
  paintDoors: room.paint_doors,
  paintWalls: room.paint_walls,
  propertyId: room.property_id,
  paintCeiling: room.paint_ceiling,
  notesCustomer: room.notes_customer,
  notesInternal: room.notes_internal,
  roomHeightFt: room.room_height_ft,
  wallAreaSqft: room.wall_area_sqft,
  floorAreaSqft: room.floor_area_sqft,
  ceilingAreaSqft: room.ceiling_area_sqft,
  ceilingHeightFt: room.ceiling_height_ft,
  wallPerimeterFt: room.wall_perimeter_ft,
  openingsAreaSqft: room.openings_area_sqft,
});

export const roomPropertyTransformer = (
  res: PropertyRoom
): PropertyRoomTransformed => {
  return transformSingleRoom(res);
};

export const allRoomPropertyTransformer = (
  res: PropertyRoom[]
): PropertyRoomTransformed[] => {
  return res.map(transformSingleRoom);
};

export const profileTransformer = (res: Profile): ProfileTransformed => {
  return {
    id: res.id,
    companyId: res.company_id,
    fullName: res.full_name || "",
    phone: res.phone || null,
    role: res.role,
    createdAt: new Date(res.created_at).toISOString(),
  };
};

export const companyTransformer = (res: Company): CompanyTransformed => {
  return {
    id: res.id,
    name: res.name,
    createdAt: new Date(res.created_at).toISOString(),
    billingEmail: res.billing_email || "",
    phone: res.phone || "",
  };
};

const transformSingleProperty = (property: Property): PropertyTransformed => ({
  id: property.id,
  zip: property.zip,
  city: property.city,
  name: property.name,
  state: property.state,
  country: property.country,
  clientId: property.client_id,
  companyId: property.company_id,
  createdAt: new Date(property.created_at).toISOString(),
  addressLine1: property.address_line1,
  addressLine2: property.address_line2 || null,
  propertyType: property.property_type,
});

export const propertyTransformer = (res: Property): PropertyTransformed => {
  return transformSingleProperty(res);
};

export const allPropertyTransformer = (
  res: Property[]
): PropertyTransformed[] => {
  return res.map(transformSingleProperty);
};

export const projectFullDataTransformer = (
  project: ProjectWithRelationsAndRooms
): ProjectFullData => {
  return {
    ...transformSingleProject(project),
    client: transformSingleClient(project.client),
    property: {
      ...transformSingleProperty(project.property),
      rooms: project.property.rooms.map(transformSingleRoom),
    },
  };
};

export const clientFullDataTransformer = (
  clientData: ClientWithRelations
): ClientFullData => {
  const transformed = {
    ...clientTransformer(clientData),
    properties: [...allPropertyTransformer(clientData.properties)],
  };
  transformed.properties = transformed.properties.map((property) => {
    return {
      ...property,
      projects: allProjectTransformer(
        clientData.properties.find((p) => p.id === property.id)?.projects || []
      ),
    };
  });
  return transformed as ClientFullData;
};
