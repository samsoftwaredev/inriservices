import Head from "next/head";
import Image from "next/image";
import { Container, Typography, Box, Paper } from "@mui/material";
import { Footer, TopNavbar } from "@/components";
import Link from "next/link";
import { theme } from "../theme";

export default function HowToPaintARoom() {
  return (
    <>
      <Head>
        <title>
          Step-by-Step Guide: How to Paint a Room Like a Pro | Professional
          Painting Near Me Garland
        </title>
        <meta
          name="description"
          content="Learn how to paint a room like a pro with this step-by-step guide. Find tips on prepping, sanding, priming, cutting in, and rolling the walls. Professional painting near me Garland."
        />
        <meta
          name="keywords"
          content="professional painting near me Garland, how to paint a room, interior painting, paint and drywall repair near me, DIY painting guide"
        />
        <meta
          property="og:title"
          content="Step-by-Step Guide: How to Paint a Room Like a Pro | Professional Painting Near Me Garland"
        />
        <meta
          property="og:description"
          content="Discover the best step-by-step process to paint a room perfectly with tips from prepping, sanding, priming, and rolling. Affordable painting services Garland."
        />
        <meta property="og:image" content="/images/paint-room-guide.jpg" />
      </Head>
      <TopNavbar />
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 0.5, sm: 2, md: 0 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#f1f2f3",
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Step-by-Step Guide to Paint a Room Like a Pro
          </Typography>
          <Typography textAlign="center" fontSize={"1em"}>
            The Process INRI Paint & Wall Follows
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: { xs: 2, md: 3 },
            }}
          >
            <Image
              src="/paint-room-guide.png"
              alt="Step-by-step guide to painting a room"
              width={800}
              height={400}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                maxWidth: "100%",
              }}
              priority
            />
          </Box>
          <Box mt={{ xs: 2, md: 3 }}>
            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: { xs: "1rem", md: "1.125rem" } }}
            >
              Painting a room can feel like a daunting task, but with the right
              steps and a little patience, you can transform any space into
              something fresh and vibrant. (Just don’t forget to wear your old
              T-shirt — you know, the one that already has enough paint samples
              to qualify as a modern art piece!) If you’ve been searching for
              <Link
                href="/contact"
                style={{ color: theme.palette.primary.main }}
              >
                professional painting near me Garland
              </Link>{" "}
              , you’re in luck—here’s a step-by-step guide that even a beginner
              can follow.
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              color="primary"
              gutterBottom
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              Step 1: The Prep Work
            </Typography>
            <Typography variant="body1" paragraph>
              Before you even think about opening a paint can, make sure the
              room is ready. Remove all big items that would get in the way of
              painting and cover the floors and hardware to protect them from
              splatters.
            </Typography>

            <Typography
              variant="h6"
              color="primary"
              component="h2"
              gutterBottom
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              Step 2: Sanding and Cleaning
            </Typography>
            <Typography variant="body1" paragraph>
              Sand the walls using a pole sander fitted with 120-grit paper.
              Don’t forget to wear a dust mask, because trust me, it gets messy
              quick. Wipe down the walls with a damp sponge and warm soapy water
              to remove any dust and grime.
            </Typography>

            <Typography
              variant="h6"
              color="primary"
              component="h2"
              gutterBottom
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              Step 3: Patching and Priming
            </Typography>
            <Typography variant="body1" paragraph>
              Fill any small holes or cracks with patching compound or joint
              compound, depending on your wall type. Let it dry and sand it
              smooth. Then, prime the walls to create a nice even base for your
              paint. This is especially important if you’re going from a dark to
              a light color or vice versa.
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              color="primary"
              gutterBottom
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              Step 4: Cutting In
            </Typography>
            <Typography variant="body1" paragraph>
              Dip a 2½-inch angled brush into a clean bucket of paint (never
              straight from the can—it can get contaminated with dried flecks).
              Tap off the excess and carefully cut in around the edges of the
              ceiling, baseboards, and corners. This gives you a border so the
              roller doesn’t accidentally hit areas it shouldn’t.
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              color="primary"
              gutterBottom
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              Step 5: Rolling the Walls
            </Typography>
            <Typography variant="body1" paragraph>
              Using a roller, apply paint in a W or M pattern, then fill in the
              gaps with even strokes. Always start at the top and work your way
              down, overlapping a bit with your cut-in edges to blend any brush
              marks. Remember, when the roller makes a peeling sound on the
              wall, it’s too dry and needs to be reloaded.
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              color="primary"
              gutterBottom
              sx={{ mt: { xs: 2, md: 3 } }}
            >
              Step 6: Second Coat and Touch-Ups
            </Typography>
            <Typography variant="body1" paragraph>
              Let the first coat dry completely before applying the second coat.
              After that, check for any missed spots or drips and touch them up
              with a brush.
            </Typography>

            <Typography variant="body1" paragraph sx={{ mt: { xs: 2, md: 3 } }}>
              Painting a room isn’t just about slapping on a new color; it’s
              about prep, patience, and the right tools. For the best results,
              consider hiring{" "}
              <Link
                href="/contact"
                style={{ color: theme.palette.primary.main }}
              >
                professional painting near me Garland
              </Link>{" "}
              who knows how to get the job done right. But if you’re going the
              DIY route, follow these steps and you’ll be surprised at how
              professional your room looks!
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
