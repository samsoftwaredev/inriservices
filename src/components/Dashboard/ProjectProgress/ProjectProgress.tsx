import { Box, LinearProgress, Typography } from "@mui/material";

interface Props {
  jobsCompleted: number;
  goalProjectCompleted: number;
}

const ProjectProgress = ({
  jobsCompleted,
  goalProjectCompleted = 10,
}: Props) => {
  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2" fontWeight="medium">
          Monthly Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {jobsCompleted} / {goalProjectCompleted} jobs
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(jobsCompleted / goalProjectCompleted) * 100}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default ProjectProgress;
