import { Box, Container, Typography, Stack, Avatar, Chip } from "@mui/material";
import { ErrorPage, Footer, Meta, TopNavbar } from "@/components";
import { MetaProps } from "@/interfaces";
import ReactMarkdown from "react-markdown";
interface Props {
  params: Promise<{ slugName: string }>;
}

export default async function Service({ params }: Props) {
  const data = {
    id: "1",
    slug: "residential-painting",
    title: "Residential Painting",
    excerpt:
      "Transform your home with our expert residential painting services.",
    cover_image_url:
      "https://example.com/images/residential-painting-cover.jpg",
    seo: {
      title: "Residential Painting - Our Services",
      metaTags: [],
      linkTags: [],
    },
    author: {
      name: "Jane Doe",
      role: "Lead Painter",
      avatar_url: "https://example.com/avatars/jane-doe.jpg",
    },
    created_at: "2023-10-01T12:00:00Z",
    tags: ["interior", "exterior", "eco-friendly"],
    reading_time_minutes: 5,
    content: `# Welcome to Our Residential Painting Service

At **INRI Paint & Wall LLC**, we specialize in transforming homes with our top-notch residential painting services. Whether you're looking to refresh a single room or give your entire house a makeover, our team of experienced painters is here to help.

## Our Services

- Interior Painting
- Exterior Painting
- Eco-Friendly Paint Options
- Custom Color Consultation

> "A fresh coat of paint can completely change the look and feel of your home." - INRI Paint & Wall LLC

We use only high-quality paints and materials to ensure a long-lasting finish that you'll love.

### Contact Us

Ready to give your home a new look? Contact us today for a free consultation and estimate!
 `,
  };
  if (!data) {
    return (
      <>
        <TopNavbar />
        <ErrorPage />
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
            sx={{
              maxWidth: "200px",
              width: "100%",
              borderRadius: 2,
              mb: 3,
              display: "flex",
              alignSelf: "center",
              justifySelf: "center",
            }}
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
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {children}
                </Typography>
              ),
              h1: ({ children }) => (
                <Typography
                  variant="h4"
                  sx={{ mt: 4, mb: 2, fontWeight: "bold" }}
                >
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography
                  variant="h5"
                  sx={{ mt: 3, mb: 1.5, fontWeight: "bold" }}
                >
                  {children}
                </Typography>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: "0.5rem", marginLeft: "1rem" }}>
                  <Typography variant="body2" component="span">
                    {children}
                  </Typography>
                </li>
              ),
              blockquote: ({ children }) => (
                <Box
                  sx={{
                    borderLeft: "4px solid #ccc",
                    pl: 2,
                    my: 2,
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                >
                  {children}
                </Box>
              ),
            }}
          >
            {data.content}
          </ReactMarkdown>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
