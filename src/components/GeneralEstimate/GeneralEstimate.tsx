"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateProfits, debounce } from "@/tools";
import {
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { InvoiceData, InvoiceGenerator } from "../InvoiceGenerator";
import { Add as AddIcon, Delete } from "@mui/icons-material";
import CustomerSelectionMenu from "../ProInteriorEstimate/CustomerSelectionMenu";
import RoomGeneralInfo from "./RoomGeneralInfo";
import { useClient } from "@/context/ClientContext";
import NewClientDialog from "../NewClientDialog";
import SearchClientDialog from "../SearchClientDialog";
import { ClientFormData } from "../SearchClient/SearchClient.model";
import { useAuth } from "@/context";
import { projectApi, propertyRoomApi, uploadProjectImages } from "@/services";
import RoomFeatureForm from "../ProInteriorEstimate/RoomFeatureForm";
import { ImageFile } from "../ImageUpload/ImageUpload.model";
import EstimateSummary from "./EstimateSummary";
import {
  ProjectCost,
  ProjectFormData,
  ProjectTransformed,
  PropertyRoomTransformed,
} from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import GeneralData from "./GeneralData";
import {
  projectFullDataTransformer,
  reversedProjectTransformer,
} from "@/tools/transformers";
import { PROFIT_MARGIN_PERCNT, TAX_RATE_PERCNT } from "@/constants";
import { compareAsc } from "date-fns/compareAsc";
import { format } from "date-fns";
import RequireClient from "../RequireClient";

const initialCosts: ProjectCost = {
  laborCost: 300,
  materialCost: 120,
  companyFee: 200,
  companyProfit: 84,
  taxes: 58,
  total: 704,
};

interface Props {
  paramsProjectId?: string;
}

const GeneralEstimate = ({ paramsProjectId }: Props) => {
  const router = useRouter();
  const { userData } = useAuth();
  const { currentClient, handleCreateNewClient, handleSelectClient } =
    useClient();

  const [isLoading, setIsLoading] = useState(paramsProjectId ? true : false);
  const [projectCost, setProjectCost] = useState<ProjectCost>(initialCosts);
  const [projectData, setProjectData] = useState<ProjectTransformed | null>(
    null,
  );
  const [isOpenSearchClientDialog, setIsOpenSearchClientDialog] =
    useState(false);
  const [isOpenNewClientDialog, setIsOpenNewClientDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [rooms, setRooms] = useState<PropertyRoomTransformed[]>([]);

  const updateLocalStorageEstimate = ({
    ...updates
  }: {
    projectId?: string;
    rooms?: PropertyRoomTransformed[];
  }) => {
    const estimateData = JSON.stringify({
      projectId,
      clientId: currentClient?.id,
      rooms,
      ...updates,
    });
    localStorage.setItem("generalEstimateRooms", estimateData);
  };

  const clearLocalStorageEstimate = () => {
    localStorage.removeItem("generalEstimateRooms");
  };

  const onOpenNewClientDialog = () => {
    setIsOpenNewClientDialog(true);
  };

  const onOpenSearchClientDialog = () => {
    setIsOpenSearchClientDialog(true);
  };

  const onCloseNewClientDialog = () => {
    setIsOpenNewClientDialog(false);
  };

  const onCloseSearchClientDialog = () => {
    setIsOpenSearchClientDialog(false);
  };

  const onSubmitNewClient = async (data: ClientFormData) => {
    handleCreateNewClient(data, userData!.companyId);
  };

  const createProject = async (): Promise<string> => {
    try {
      const projectRes = await projectApi.createProject({
        client_id: currentClient!.id,
        company_id: userData!.companyId,
        property_id: currentClient!.properties[0].id,
        end_date: new Date().toISOString(),
        invoice_total_cents: 0,
        labor_cost_cents: 0,
        labor_hours_estimated: null,
        markup_bps: 0,
        material_cost_cents: 0,
        name: `General Estimate for ${currentClient?.displayName}`,
        project_type: "other",
        scope_notes: null,
        start_date: new Date().toISOString(),
        status: "draft",
        tax_amount_cents: 0,
        tax_rate_bps: 0,
      });
      return projectRes.id;
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project", {
        toastId: "create-project-error",
      });
      return "";
    }
  };

  const createRoom = async (
    roomDetails: PropertyRoomTransformed,
    pId: string,
  ): Promise<string> => {
    try {
      const roomRes = await propertyRoomApi.createRoom({
        name: roomDetails.name,
        property_id: currentClient!.properties[0].id,
        project_id: pId,
        level: roomDetails.level,
        sort_order: roomDetails.sortOrder,
        ceiling_area_sqft: roomDetails.ceilingAreaSqft,
        ceiling_height_ft: roomDetails.ceilingHeightFt,
        company_id: userData!.companyId,
        description: roomDetails.description,
        floor_area_sqft: roomDetails.floorAreaSqft,
        notes_customer: roomDetails.notesCustomer,
        notes_internal: roomDetails.notesInternal,
        openings_area_sqft: roomDetails.openingsAreaSqft,
        paint_ceiling: roomDetails.paintCeiling,
        paint_doors: roomDetails.paintDoors,
        paint_trim: roomDetails.paintTrim,
        paint_walls: roomDetails.paintWalls,
        room_height_ft: roomDetails.roomHeightFt,
        wall_area_sqft: roomDetails.wallAreaSqft,
        wall_perimeter_ft: roomDetails.wallPerimeterFt,
      });
      return roomRes.id;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room", { toastId: "create-room-error" });
      return "";
    }
  };

  const updateRoom = async (
    roomId: string,
    updatedData: Partial<PropertyRoomTransformed>,
  ) => {
    try {
      await propertyRoomApi.updateRoom(roomId, updatedData);
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room", { toastId: "update-room-error" });
    }
  };

  const onDeleteRoom = async (roomId: string) => {
    try {
      await propertyRoomApi.deleteRoom(roomId);
      const filteredRooms = rooms.filter((room) => room.id !== roomId);
      setRooms(filteredRooms);
      updateLocalStorageEstimate({ rooms: filteredRooms });
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room", { toastId: "delete-room-error" });
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (projectId) {
        await projectApi.deleteProject(projectId);
      }
      setProjectId("");
      clearLocalStorageEstimate();
      setDeleteConfirmOpen(false);
      router.push("/estimates");
      // Optionally redirect or show success message
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete estimate", {
        toastId: "delete-project-error",
      });
    }
  };

  const updateProject = async (data: ProjectTransformed) => {
    try {
      await projectApi.updateProject(
        projectId,
        reversedProjectTransformer(data),
      );
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project", {
        toastId: "update-project-error",
      });
    }
  };

  const onImagesChange = async (images: ImageFile[]) => {
    await uploadProjectImages({
      projectId,
      companyId: userData!.companyId,
      kind: "before",
      files: images.map((image) => image.file),
      caption: "",
    });
  };

  const addNewRoom = async () => {
    const newRoom = {
      name: `Room ${rooms.length + 1}`,
      description: "",
      level: 1,
      companyId: userData!.companyId,
      createdAt: new Date().toISOString(),
      paintTrim: false,
      projectId: projectId || null,
      sortOrder: rooms.length + 1,
      updatedAt: new Date().toISOString(),
      paintDoors: false,
      paintWalls: false,
      propertyId: currentClient!.properties[0].id,
      paintCeiling: false,
      notesCustomer: null,
      notesInternal: null,
      roomHeightFt: null,
      wallAreaSqft: null,
      floorAreaSqft: null,
      ceilingAreaSqft: null,
      ceilingHeightFt: null,
      wallPerimeterFt: null,
      openingsAreaSqft: null,
      id: "", // Temporary ID, will be replaced after creation
    };

    if (rooms.length > 0) {
      const roomId = await createRoom(newRoom, projectId);
      newRoom.id = roomId;
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      updateLocalStorageEstimate({ rooms });
    } else {
      const projectIdLocal = await createProject();
      setProjectId(projectIdLocal);
      updateLocalStorageEstimate({ projectId: projectIdLocal });
      const roomId = await createRoom(newRoom, projectIdLocal);
      newRoom.id = roomId;
      setRooms([newRoom]);
      updateLocalStorageEstimate({ rooms });
      debugger;
      router.push(`/estimates/general/${projectId}`);
    }
  };

  const onChangeRoomData = (
    roomId: string,
    title: string,
    description: string,
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, name: title, description } : room,
      ),
    );
    updateLocalStorageEstimate({ rooms });
    updateRoom(roomId, { name: title, description });
  };

  const debouncedOnChangeRoomData = debounce(onChangeRoomData, 500);

  const invoiceData: InvoiceData = useMemo(
    () => ({
      customer: {
        name: currentClient?.displayName || "",
        email: currentClient?.email || "",
        address: currentClient?.properties[0].addressLine1 || "",
        city: currentClient?.properties[0].city || "",
        state: currentClient?.properties[0].state || "",
        zipCode: currentClient?.properties[0].zip || "",
      },
      items: rooms.map((room) => ({
        id: room.id,
        description: `${room.name} - ${room.description || ""}`,
        quantity: 1,
        rate: 0,
        amount: 0,
      })),
      projectName: projectData?.name || "Whole House Interior Refresh",
      notes:
        "Customer requested eco-friendly paint. All furniture will be covered and protected during work.",
      invoiceNumber: projectId.slice(-7), // Using last 7 characters of projectId as invoice number
      date: new Date().toLocaleDateString(),
      dueDate: new Date(
        new Date().setDate(new Date().getDate() + 30),
      ).toLocaleDateString(),
      subtotal:
        projectCost.materialCost +
        projectCost.laborCost +
        projectCost.companyFee,
      taxRate: TAX_RATE_PERCNT,
      tax: projectCost.taxes,
      total: projectCost.total,
    }),
    [rooms, currentClient, projectCost],
  );

  const onProjectDataChange = async (data: ProjectFormData) => {
    const dataChanged =
      data.endDate &&
      data.startDate &&
      projectData?.endDate &&
      projectData?.startDate &&
      compareAsc(data.endDate, projectData?.endDate) === 0 &&
      compareAsc(data.startDate, projectData?.startDate) === 0;

    if (dataChanged || data.name === projectData?.name) {
      return;
    } else if (projectId && projectData) {
      await updateProject({
        ...projectData,
        name: data.name,
        startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : "",
        endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : "",
        scopeNotes: data.scopeNotes || "",
      });
    }
  };

  const debouncedOnProjectDataChange = debounce(onProjectDataChange, 500);

  const onCostsChange = async (newCosts: ProjectCost) => {
    const convertToFloatCents2Decimal = (amount: string | number) => {
      return Math.round(Number(amount) * 100);
    };

    if (projectId && projectData) {
      await updateProject({
        ...projectData,
        materialCostCents: convertToFloatCents2Decimal(newCosts.materialCost),
        laborCostCents: convertToFloatCents2Decimal(newCosts.laborCost),
        taxAmountCents: convertToFloatCents2Decimal(newCosts.taxes),
        invoiceTotalCents: convertToFloatCents2Decimal(newCosts.total),
        taxRateBps: TAX_RATE_PERCNT * 10000,
        markupBps: PROFIT_MARGIN_PERCNT * 10000,
      });
      setProjectCost(newCosts);
    }
  };

  const getProjectData = async (pId: string) => {
    setIsLoading(true);
    try {
      const projectRes = await projectApi.getProject(pId);
      const transformedProject = projectFullDataTransformer(projectRes);
      setProjectData(transformedProject);
      const convertCentsToDollar = (cents: number) => cents / 100;
      setProjectCost({
        laborCost: convertCentsToDollar(transformedProject.laborCostCents),
        materialCost: convertCentsToDollar(
          transformedProject.materialCostCents,
        ),
        companyFee: 200, // Placeholder as company fee is not stored
        companyProfit: calculateProfits(
          convertCentsToDollar(transformedProject.laborCostCents),
          convertCentsToDollar(transformedProject.materialCostCents),
        ),
        taxes: convertCentsToDollar(transformedProject.taxAmountCents),
        total: convertCentsToDollar(transformedProject.invoiceTotalCents),
      });
      handleSelectClient(transformedProject.clientId);
      setRooms(transformedProject.property.rooms || []);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const storedEstimate = localStorage.getItem("generalEstimateRooms");
  //   const { projectId = "", rooms = [] } = JSON.parse(storedEstimate || "{}");
  //   if (storedEstimate) {
  //     setProjectId(projectId);
  //     getProjectData(projectId);
  //     setRooms(rooms);
  //   }
  // }, []);

  useEffect(() => {
    if (paramsProjectId) {
      clearLocalStorageEstimate();
      setProjectId(paramsProjectId);
      getProjectData(paramsProjectId);
    }
  }, [paramsProjectId]);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h6">Loading Estimate...</Typography>
      </Box>
    );
  }

  return (
    <>
      <CustomerSelectionMenu
        title={"General Estimate"}
        subtitle={"Select a customer for this estimate"}
        onCreateNewCustomer={onSubmitNewClient}
        onCreateNewLocation={() => {}}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        {currentClient ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {currentClient.displayName}
              </Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{currentClient.email}</Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{currentClient.phone}</Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {currentClient?.properties[0].addressLine1}{" "}
                {currentClient?.properties[0].addressLine2}
                <br />
                {currentClient?.properties[0].city},{" "}
                {currentClient?.properties[0].state}{" "}
                {currentClient?.properties[0].zip}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <RequireClient
            onOpenSearchClientDialog={onOpenSearchClientDialog}
            onOpenNewClientDialog={onOpenNewClientDialog}
          />
        )}
      </Paper>

      {projectId && (
        <GeneralData
          initialData={projectData}
          onFormChange={debouncedOnProjectDataChange}
        />
      )}

      <Box>
        {rooms.map((room, index) => (
          <Paper key={room.id} sx={{ p: 2, mb: 2 }}>
            <RoomGeneralInfo
              room={room}
              index={index}
              onDeleteRoom={onDeleteRoom}
            />
            <RoomFeatureForm
              room={room}
              onChangeRoomData={debouncedOnChangeRoomData}
              onImagesChange={onImagesChange}
            />
          </Paper>
        ))}

        <Box sx={{ mb: 3 }} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={addNewRoom}
            disabled={!currentClient}
            startIcon={<AddIcon />}
            sx={{ mr: 2, width: { md: 250, xs: "100%" } }}
          >
            Add Room
          </Button>
        </Box>

        <EstimateSummary
          rooms={rooms}
          onCostsChange={onCostsChange}
          initialCosts={projectCost}
        />

        <Box
          sx={{ mb: 3 }}
          display="flex"
          justifyContent="center"
          flexDirection={{ xs: "column", md: "row" }}
        >
          {/* Invoice Generator Demo */}
          <InvoiceGenerator
            invoiceData={invoiceData}
            buttonText="Download Invoice PDF"
            variant="outlined"
          />
          <Box>
            <Button
              variant="text"
              color="error"
              sx={{
                width: { md: 200, xs: "100%" },
              }}
              startIcon={<Delete />}
              onClick={handleDeleteClick}
              disabled={!projectId}
            >
              Delete Estimate
            </Button>
          </Box>
        </Box>
      </Box>

      <NewClientDialog
        onClose={onCloseNewClientDialog}
        isOpen={isOpenNewClientDialog}
        onSubmit={onSubmitNewClient}
      />

      <SearchClientDialog
        isOpen={isOpenSearchClientDialog}
        onClose={onCloseSearchClientDialog}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Estimate</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this estimate?
            {currentClient && (
              <>
                <br />
                <br />
                <strong>Client:</strong> {currentClient.displayName}
                <br />
                <strong>Rooms:</strong> {rooms.length} room
                {rooms.length !== 1 ? "s" : ""}
                <br />
                <br />
              </>
            )}
            This action cannot be undone and will permanently remove all
            estimate data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GeneralEstimate;
