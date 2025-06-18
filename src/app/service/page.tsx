import {
  Grid,
  Typography,
  Card,
  CardContent,
  Container,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import { Footer, Meta, TopNavbar } from "@/components";
import { ref, child, get, getDatabase } from "firebase/database";
import { app } from "@/app/firebaseConfig";

async function fetchMyDataOnce() {
  const database = getDatabase(app);
  const dbRef = ref(database);
  const dataPath = `/service`;
  try {
    const snapshot = await get(child(dbRef, dataPath));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default async function Service() {
  const data = await fetchMyDataOnce();

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" color="error">
          Service not found.
        </Typography>
      </Container>
    );
  }

  // data is an object of objects: { [slug]: serviceObj }
  const serviceList = Object.values(data);

  return (
    <>
      <Meta />
      <TopNavbar />

      <Container sx={{ my: 10 }} component="main" maxWidth="lg">
        <Typography component="h1" variant="h4" gutterBottom>
          🛠️ Our Painting Services
        </Typography>

        <Typography
          component="p"
          variant="body1"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          We offer a full range of residential and commercial painting services
          designed to transform your space.
        </Typography>

        <Grid container spacing={3}>
          {serviceList.map((service: any) => (
            <Grid
              component={"a"}
              href={`/service/${service.slug}`}
              sx={{ cursor: "pointer", textDecoration: "none" }}
              size={{ xs: 12, sm: 6, md: 4 }}
              key={service.id}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    borderColor: "primary.main",
                  },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {service.cover_image_url && (
                  <Box
                    component="img"
                    src={service.cover_image_url}
                    alt={service.title}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    component="h2"
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {service.excerpt}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {service.author?.avatar_url && (
                      <Avatar
                        src={service.author.avatar_url}
                        alt={service.author.name}
                        sx={{ width: 28, height: 28, mr: 1 }}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {service.author?.name} &mdash; {service.category}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}
                  >
                    {service.tags?.map((tag: string) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {service.reading_time_minutes} min read
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
