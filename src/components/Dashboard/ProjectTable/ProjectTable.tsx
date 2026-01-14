import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { WorkHistoryItem } from "@/types";
import { projectApi } from "@/services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  translateProjectStatus,
  translateProjectType,
} from "@/tools/transformers";

interface Props {
  workHistory: WorkHistoryItem[];
  onRefreshTable: () => void;
}

const ProjectTable = ({ workHistory, onRefreshTable }: Props) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] =
    useState<WorkHistoryItem | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    workId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWorkId(workId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "primary";
      case "scheduled":
        return "info";
      case "in_progress":
        return "warning";
      case "on_hold":
        return "error";
      case "completed":
        return "success";
      case "canceled":
        return "error";
      default:
        return "default";
    }
  };

  const handleDeleteProject = () => {
    const projectToDelete = workHistory.find(
      (work) => work.id === selectedWorkId
    );
    if (projectToDelete) {
      setProjectToDelete(projectToDelete);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        await projectApi.deleteProject(projectToDelete.id);
        toast.success("Project deleted successfully");
        onRefreshTable();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleViewProjectDetails = () => {
    const projectToView = workHistory.find(
      (work) => work.id === selectedWorkId
    );
    if (projectToView) {
      router.push(`/dashboard/${projectToView.id}`);
    }
    handleMenuClose();
  };

  const handleEditProjectDetails = () => {
    const projectToView = workHistory.find(
      (work) => work.id === selectedWorkId
    );
    if (projectToView) {
      router.push(`/dashboard/${projectToView.id}?edit=true`);
    }
    handleMenuClose();
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>Customer</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="center">Rooms</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="right">Total Cost</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workHistory.map((work) => (
              <TableRow
                key={work.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {work.customerName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{work.address}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {work.city}, {work.state}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={work.numberOfRooms}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={translateProjectType(work.projectType)}
                    size="small"
                    color={
                      work.projectType === "interior_paint"
                        ? "primary"
                        : "success"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    ${work.totalCost.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {new Date(work.date).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={translateProjectStatus(work.status)}
                    size="small"
                    color={getStatusColor(work.status) as any}
                    variant="filled"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, work.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleViewProjectDetails}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleDeleteProject}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete Estimate
        </MenuItem>
        <MenuItem onClick={handleEditProjectDetails}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Estimate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <SendIcon sx={{ mr: 1, fontSize: 18 }} />
          Send Document
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Project Estimate
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the estimate for{" "}
            <strong>{projectToDelete?.customerName}</strong> at{" "}
            <strong>{projectToDelete?.address}</strong>?
            <br />
            <br />
            This action cannot be undone and will permanently remove all project
            data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ProjectTable;
