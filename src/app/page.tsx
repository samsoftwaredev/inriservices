"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Head from "next/head";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { theme } from "./theme";
import { ThemeRegistry } from "./ThemeRegistry";
import { Paper } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";

const pricingData = [
  {
    imageSrc: "/painterOrange.png",
    title: "Small PATCH area",
    subTitle: "(1-5 inches)",
    description: ["Quick fixes for minor damage"],
    price: "$50 - $100",
    image: "/cartoon-painter-1.svg",
  },
  {
    imageSrc: "/plumber.png",
    title: "Medium PATCH area",
    subTitle: "(6-12 inches)",
    description: ["For moderate repairs that need precision"],
    price: "$150 - $250",
    image: "/cartoon-painter-2.svg",
  },
  {
    imageSrc: "/painter.png",
    title: "Large PATCH area",
    subTitle: "(13+ inches)",
    description: ["Extensive repairs requiring more materials and time"],
    price: "$300+",
    image: "/cartoon-painter-3.svg",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <ThemeRegistry>
      <Head>
        <title>
          INRIservices.com - Expert Painting & Drywall Repair Services
        </title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Container maxWidth="md" className={styles["grid-background"]}>
        {/* Header Section */}
        <Box sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }} display="flex">
          <AutoAwesomeIcon />
          <Typography
            variant="h1"
            component="h2"
            color="primary.main"
            sx={{
              fontSize: { xs: "1.2rem", md: "2.5rem" },
              textTransform: "uppercase",
              fontWeight: "500",
            }}
          >
            Expert Painting & Drywall Repair
            <Box
              sx={{
                fontWeight: "500",
                fontSize: { xs: "1.2rem", md: "3.5rem" },
              }}
              color="warning.main"
              display="block"
              component="span"
            >
              Services
            </Box>
          </Typography>
          <AutoAwesomeIcon />
        </Box>
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

        <Box
          sx={{
            px: 3,
            py: { xs: 1, md: 1 },
            flex: 1,
            textAlign: "center",
            borderWidth: 3,
            borderRadius: 10,
            backgroundColor: "black",
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontWeight: "bold",
              color: "white",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Our Pricing & Packages
          </Typography>
        </Box>

        {/* Pricing and Packages Section */}
        <Box sx={{ my: { xs: 4, md: 6 } }}>
          <Grid container spacing={4}>
            {pricingData.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    zIndex: index + 1,
                  }}
                >
                  <Grid
                    sx={{
                      position: "absolute",
                      top: { md: "70px", sm: "auto", xs: "10px" },
                      left: { md: "150px", sm: "auto", xs: "auto" },
                      right: { md: "auto", sm: 0, xs: "120px" },
                      height: {
                        xs: "200px",
                        sm: "150px",
                        md: "200px",
                      },
                    }}
                  >
                    <Image
                      className={styles.worker}
                      src={item.imageSrc}
                      alt="Painter"
                      objectFit="cover"
                      fill
                    />
                  </Grid>
                </Box>
                <Card
                  sx={{
                    zIndex: index,
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    flexDirection: "column",
                    border: "2px solid",
                    maxWidth: { md: "200px", sm: "150px", xs: "320px" },
                    backgroundColor: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    borderTopLeftRadius: "50px",
                    borderTopRightRadius: "50px",
                  }}
                >
                  <CardContent sx={{}}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      color="white"
                      fontWeight="bold"
                      textAlign={"center"}
                      sx={{
                        position: "relative",
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      {item.subTitle}
                    </Typography>
                    {item.description.map((desc, i) => (
                      <Typography
                        variant="body1"
                        key={i}
                        sx={{ mt: 1, fontSize: { xs: "0.8rem", md: "1rem" } }}
                      >
                        {desc}
                      </Typography>
                    ))}
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 2,
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", md: "1.2rem" },
                      }}
                    >
                      {item.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Discount & Call to Action Section */}
        <Box
          sx={{
            my: { xs: 4, md: 6 },
            textAlign: "center",
            p: { xs: 2, md: 3 },
            backgroundColor: theme.palette.info.main,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, md: 2 },
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Special Introductory Offer!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 1, md: 2 },
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Get <strong>discounts for first-time service</strong> – Limited time
            only!
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: { xs: 1, md: 2 },
              fontSize: { xs: "0.8rem", md: "1rem" },
            }}
          >
            Offer ends July 1st, 2025.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
            onClick={() => router.push("/contact")}
          >
            Book Your Service Now!
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
          >
            © {new Date().getFullYear()} INRIservices.com. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </ThemeRegistry>
  );
}
