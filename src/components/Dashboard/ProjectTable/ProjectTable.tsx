import {
  Box,
  Chip,
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

interface Props {
  workHistory: WorkHistoryItem[];
}

const ProjectTable = ({ workHistory }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

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
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "pending_signature":
        return "warning";
      case "document_sent":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending_signature":
        return "Pending Signature";
      case "document_sent":
        return "Document Sent";
      default:
        return status;
    }
  };

  const handleDeleteProject = () => {};

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
                    label={work.projectType}
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
                    label={getStatusLabel(work.status)}
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
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleDeleteProject}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete Estimate
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Estimate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <SendIcon sx={{ mr: 1, fontSize: 18 }} />
          Send Document
        </MenuItem>
      </Menu>
    </>
  );
};
export default ProjectTable;
