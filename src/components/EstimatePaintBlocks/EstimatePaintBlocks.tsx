import { Box, Typography } from "@mui/material";
import CustomSKU from "./CustomSKU";
import LegoBlockEstimation from "../LegoBlockEstimationPage";

const EstimatePaintBlocks = () => {
  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}
    >
      <Typography variant="h4">Estimate Paint Blocks</Typography>
      <LegoBlockEstimation />
      <CustomSKU />
    </Box>
  );
};

export default EstimatePaintBlocks;
