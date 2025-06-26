import React from "react";
import { Button, Container, Paper, Typography, Box } from "@mui/material";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          color="primary"
          fontWeight="bold"
          sx={{
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            textAlign: "center",
          }}
        >
          Oops! 🎨
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            mb: { xs: 1, sm: 2 },
            textAlign: "center",
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          Looks like this page is down.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: { xs: 2, sm: 3 },
            textAlign: "center",
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          Maybe try checking the URL or going back to the homepage?
        </Typography>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Link href="/" passHref legacyBehavior>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                textTransform: "none",
              }}
            >
              🏠 Back to Painting Your Home
            </Button>
          </Link>
        </Box>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            mt: { xs: 2, sm: 3 },
            textAlign: "center",
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        >
          If you think this is a mistake, please let us know — we’ll patch it up
          in no time!
        </Typography>
      </Paper>
    </Container>
  );
};

export default ErrorPage;
