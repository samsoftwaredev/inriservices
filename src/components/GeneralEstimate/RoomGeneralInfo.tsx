import { PropertyRoomTransformed } from "@/types";
import {
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  room: PropertyRoomTransformed;
  index: number;
  onDeleteRoom: (roomId: string) => void;
}

const RoomGeneralInfo = ({ room, index, onDeleteRoom }: Props) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDeleteRoom(room.id);
    setDeleteConfirmOpen(false);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Room {index + 1}
        </Typography>
        <Tooltip title="Delete Room">
          <IconButton onClick={handleDeleteClick} size="small" color="error">
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-room-dialog-title"
        aria-describedby="delete-room-dialog-description"
      >
        <DialogTitle id="delete-room-dialog-title">Delete Room</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-room-dialog-description">
            Are you sure you want to delete{" "}
            <strong>{room.name || `Room ${index + 1}`}</strong>?
            <br />
            <br />
            This action cannot be undone and will permanently remove all room
            data.
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
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomGeneralInfo;
