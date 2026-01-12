"use client";

import { useEffect, useState } from "react";
import { uuidv4, generateSampleInvoice } from "@/tools";
import { Button, Box, Typography, Paper, Grid, Stack } from "@mui/material";
import { InvoiceGenerator } from "../InvoiceGenerator";
import {
  Add as AddIcon,
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

interface RoomSections {
  id: string;
  name: string;
  title: string;
  description: string;
  floorNumber: number;
}

const GeneralEstimate = () => {
  const { userData } = useAuth();
  const { currentClient, handleCreateNewClient } = useClient();
  const [isOpenSearchClientDialog, setIsOpenSearchClientDialog] =
    useState(false);
  const [isOpenNewClientDialog, setIsOpenNewClientDialog] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [rooms, setRooms] = useState<RoomSections[]>([]);

  const updateLocalStorageEstimate = ({
    ...updates
  }: {
    projectId?: string;
    rooms?: RoomSections[];
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

  const createProject = async () => {
    const projectRes = await projectApi.createProject({
      client_id: currentClient!.id,
      company_id: userData!.companyId,
      property_id: currentClient!.buildings[0].id,
      end_date: new Date().toISOString(),
      invoice_total_cents: 0,
      labor_cost_cents: 0,
      labor_hours_estimated: null,
      markup_bps: 0,
      material_cost_cents: 0,
      name: `General Estimate for ${currentClient?.fullName}`,
      project_type: "interior_paint",
      scope_notes: null,
      start_date: new Date().toISOString(),
      status: "draft",
      tax_amount_cents: 0,
      tax_rate_bps: 0,
    });
    setProjectId(projectRes.id);
    updateLocalStorageEstimate({ projectId: projectRes.id });
  };

  const createRoom = async () => {
    await propertyRoomApi.createRoom({
      name: "Updated Room Name",
      property_id: currentClient!.buildings[0].id,
      project_id: projectId,
      level: 1,
      sort_order: 1,
      ceiling_area_sqft: null,
      ceiling_height_ft: null,
      company_id: userData!.companyId,
      description: null,
      floor_area_sqft: null,
      notes_customer: null,
      notes_internal: null,
      openings_area_sqft: null,
      paint_ceiling: false,
      paint_doors: false,
      paint_trim: false,
      paint_walls: false,
      room_height_ft: null,
      wall_area_sqft: null,
      wall_perimeter_ft: null,
    });
  };

  const updateRoom = async (roomId: string) => {
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
  };

  const deleteRoom = async (roomId: string) => {
    await propertyRoomApi.deleteRoom(roomId);
    const filteredRooms = rooms.filter((room) => room.id !== roomId);
    updateLocalStorageEstimate({ rooms: filteredRooms });
  };

  const deleteProject = async () => {
    await projectApi.deleteProject(projectId);
    setProjectId("");
    removeLocalStorageEstimate();
  };

  const updateProject = async () => {
    const projectRes = await projectApi.updateProject(projectId, {
      client_id: currentClient!.id,
      end_date: new Date().toISOString(),
      invoice_total_cents: 0,
      labor_cost_cents: 0,
      labor_hours_estimated: null,
      markup_bps: 0,
      material_cost_cents: 0,
      name: `General Estimate for ${currentClient?.fullName}`,
      project_type: "interior_paint",
      property_id: currentClient!.buildings[0].id,
      scope_notes: null,
      start_date: new Date().toISOString(),
      status: "draft",
      tax_amount_cents: 0,
      tax_rate_bps: 0,
    });
    setProjectId(projectRes.id);
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
      id: uuidv4(),
      name: `Room ${rooms.length + 1}`,
      title: "",
      description: "",
      floorNumber: 1,
    };

    if (rooms.length >= 1) {
      setRooms(() => [...rooms, newRoom]);
    } else {
      setRooms([newRoom]);
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

  useEffect(() => {
    const storedEstimate = localStorage.getItem("generalEstimateRooms");
    const { projectId = "", rooms = [] } = JSON.parse(storedEstimate || "{}");
    if (storedEstimate) {
      setProjectId(projectId);
      setRooms(rooms);
    }
  }, []);

  useEffect(() => {
    if (currentClient && !projectId) {
      createProject();
    }
  }, [currentClient]);

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
              <Typography variant="body1">{currentClient.fullName}</Typography>
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
                {currentClient?.buildings[0].address}{" "}
                {currentClient?.buildings[0].address2}
                <br />
                {currentClient?.buildings[0].city},{" "}
                {currentClient?.buildings[0].state}{" "}
                {currentClient?.buildings[0].zipCode}
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

      <Box>
        {rooms.map((room, index) => (
          <Paper key={room.id} sx={{ p: 2, mb: 2 }}>
            <RoomGeneralInfo
              room={room}
              index={index}
              onChangeRoomName={onChangeRoomName}
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
            startIcon={<AddIcon />}
            sx={{ mr: 2, width: { md: 250, xs: "100%" } }}
          >
            Add Room
          </Button>
        </Box>

        {/* Estimate Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Estimate Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Rooms: {rooms.length}
          </Typography>
          <Typography variant="h6" color="primary">
            Estimated Total: ${rooms.length * 450 + (rooms.length - 1) * 50}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            *Tax not included. Final pricing may vary based on specific
            requirements.
          </Typography>
        </Paper>

        <Box sx={{ mb: 3 }} display="flex" justifyContent="center">
          {/* Invoice Generator Demo */}
          <InvoiceGenerator
            invoiceData={generateSampleInvoice()}
            buttonText="Download Invoice PDF"
            variant="outlined"
          />
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
    </>
  );
};

export default GeneralEstimate;
