import { theme } from "@/app/theme"
import { Box, Paper, Typography } from "@mui/material"

const PatchSpecial = () => {
    return (
        <Box sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}>
          <Box
            component={Paper}
            elevation={8}
            sx={{
              m: { xs: 2, md: 3 },
              px: 3,
              py: { xs: 1, md: 1 },
              borderStyle: "dashed",
              borderWidth: 3,
              borderColor: theme.palette.primary.main,
              borderRadius: 10,
              backgroundColor: theme.palette.warning.main,
              display: "inline-block",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              <strong>3 Small Patches + Touch-Up Paint – Only $200!</strong>
            </Typography>
          </Box>
        </Box>
    )
}

export default PatchSpecial