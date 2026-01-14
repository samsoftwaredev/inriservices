"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateProfits, debounce, uuidv4 } from "@/tools";
import {
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { InvoiceData, InvoiceGenerator } from "../InvoiceGenerator";
import {
  Add as AddIcon,
  Delete,
  PersonAddAlt as PersonAddIcon,
} from "@mui/icons-material";
import CustomerSelectionMenu from "../ProInteriorEstimate/CustomerSelectionMenu";
import RoomGeneralInfo from "./RoomGeneralInfo";
import { useClient } from "@/context/ClientContext";
import { Person as PersonIcon } from "@mui/icons-material";
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
import { TAX_RATE } from "@/constants";
import { compareAsc } from "date-fns/compareAsc";
import { format } from "date-fns";

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
    null
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

  const removeLocalStorageEstimate = () => {
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
      toast.error("Failed to create project");
      return "";
    }
  };

  const createRoom = async (
    roomDetails: PropertyRoomTransformed,
    pId: string
  ) => {
    try {
      await propertyRoomApi.createRoom({
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
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    }
  };

  const updateRoom = async (roomId: string) => {
    try {
      await propertyRoomApi.updateRoom(roomId, {
        name: "Updated Room Name",
      });
      const updatedRooms = rooms.filter((room) => {
        if (room.id === roomId) {
          return { ...room, name: "Updated Room Name" };
        } else {
          return room;
        }
      });
      updateLocalStorageEstimate({ rooms: updatedRooms });
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
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
      toast.error("Failed to delete room");
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
      removeLocalStorageEstimate();
      setDeleteConfirmOpen(false);
      router.push("/estimates");
      // Optionally redirect or show success message
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete estimate");
    }
  };

  const updateProject = async (data: ProjectTransformed) => {
    try {
      await projectApi.updateProject(
        projectId,
        reversedProjectTransformer(data)
      );
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
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
    const newRoom: PropertyRoomTransformed = {
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
      id: uuidv4(),
    };

    if (rooms.length >= 1) {
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    } else {
      const projectId = await createProject();
      setProjectId(projectId);
      await createRoom(newRoom, projectId);
      setRooms([newRoom]);
      updateLocalStorageEstimate({ projectId });
    }

    updateLocalStorageEstimate({ rooms });
  };

  const onChangeRoomName = (roomId: string, roomName: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, name: roomName } : room
      )
    );
    updateLocalStorageEstimate({ rooms });
  };

  const onChangeRoomData = (
    roomId: string,
    title: string,
    description: string
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, title, description } : room
      )
    );
    updateLocalStorageEstimate({ rooms });
  };

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
        new Date().setDate(new Date().getDate() + 30)
      ).toLocaleDateString(),
      subtotal:
        projectCost.materialCost +
        projectCost.laborCost +
        projectCost.companyFee,
      taxRate: TAX_RATE,
      tax: projectCost.taxes,
      total: projectCost.total,
    }),
    [rooms, currentClient, projectCost]
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
      });
    }
  };

  const debouncedOnProjectDataChange = debounce(onProjectDataChange, 500);

  const onCostsChange = async (newCosts: ProjectCost) => {
    if (projectId && projectData) {
      await updateProject({
        ...projectData,
        materialCostCents: newCosts.materialCost,
        laborCostCents: newCosts.laborCost,
        taxAmountCents: newCosts.taxes,
        invoiceTotalCents: newCosts.total,
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
      setProjectCost({
        laborCost: transformedProject.laborCostCents,
        materialCost: transformedProject.materialCostCents,
        companyFee:
          transformedProject.laborCostCents -
          transformedProject.materialCostCents -
          transformedProject.taxAmountCents,
        companyProfit: calculateProfits(
          transformedProject.laborCostCents,
          transformedProject.materialCostCents
        ),
        taxes: transformedProject.taxAmountCents,
        total: transformedProject.invoiceTotalCents,
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
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PersonIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Select Client
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Once a client is selected, you can create an estimate.
              </Typography>
              <Stack
                gap={3}
                direction={{ xs: "column", md: "row" }}
                justifyContent="center"
              >
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                  onClick={onOpenSearchClientDialog}
                >
                  Select Client
                </Button>
                <Button
                  startIcon={<PersonAddIcon />}
                  onClick={onOpenNewClientDialog}
                  sx={{ ml: 2 }}
                >
                  Create New Client
                </Button>
              </Stack>
            </Box>
          </Grid>
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
              onChangeRoomName={onChangeRoomName}
              onDeleteRoom={onDeleteRoom}
            />
            <RoomFeatureForm
              room={room}
              onChangeRoomData={onChangeRoomData}
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
