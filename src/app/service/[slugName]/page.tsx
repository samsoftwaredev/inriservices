import { Box, Container, Typography, Stack, Avatar, Chip } from "@mui/material";
import { Footer, Meta, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import { ref, child, get, getDatabase } from "firebase/database";
import { app } from "@/app/firebaseConfig";
import ReactMarkdown from "react-markdown";

async function fetchMyDataOnce(path: string) {
  const database = getDatabase(app);
  const dbRef = ref(database);
  const dataPath = `/service/${path}`;
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
interface Props {
  params: Promise<{ slugName: string }>;
}
// eslint-disable-next-line
export default async function Service({ params }: Props) {
  const { slugName } = await params;
  const data = await fetchMyDataOnce(slugName);

  if (!data) {
    return (
      <>
        <TopNavbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography variant="h3" color="error">
            Service not found.
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  // Use SEO from data if available, otherwise fallback
  const metaProps: MetaProps = data.seo || {
    title: data.title,
    metaTags: [],
    linkTags: [],
  };

  return (
    <>
      <TopNavbar />
      <Meta {...metaProps} />
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Cover Image */}
        {data.cover_image_url && (
          <Box
            component="img"
            src={data.cover_image_url}
            alt={data.title}
            sx={{ width: "100%", borderRadius: 2, mb: 3 }}
          />
        )}

        {/* Title & Excerpt */}
        <Typography variant="h2" fontSize="2.5rem" gutterBottom>
          {data.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {data.excerpt}
        </Typography>

        {/* Author, Date, Reading Time */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {data.author?.avatar_url && (
            <Avatar src={data.author.avatar_url} alt={data.author.name} />
          )}
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {data.author?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.author?.role}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            {new Date(data.created_at).toLocaleDateString()} •{" "}
            {data.reading_time_minutes} min read
          </Typography>
        </Stack>

        {/* Tags */}
        {data.tags && (
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {data.tags.map((tag: string) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        )}

        {/* Content */}
        <Box sx={{ mt: 4 }}>
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
