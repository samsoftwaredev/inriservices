"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { companyName } from "@/constants";

const images = [
  "/payments.jpg",
  "/trusted.jpg",
  "/googleReviews.webp",
  "/madeInUSA.png",
  "/yelpReviews.png",
  "/satisfaction.png",
  "/madeInTexas.avif",
];

const VISIBLE_COUNT = 5;
const INTERVAL = 3000; // 3 seconds

interface Props {
  title?: string;
  description?: string;
}

const TrustBadges = ({
  title = companyName,
  description = "Professional Painting You Can Trust in Garland, TX",
}: Props) => {
  const [startIndex, setStartIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setStartIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    timeoutRef.current = setInterval(next, INTERVAL);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  const getVisibleImages = () => {
    return Array.from({ length: VISIBLE_COUNT }, (_, i) => {
      const index = (startIndex + i) % images.length;
      return images[index];
    });
  };

  return (
    <Box overflow="hidden" width="100%" p={2} textAlign={"center"}>
      <Box
        sx={{
          textAlign: "center",
          my: { xs: 2, md: 4 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
        <Typography component="h2">{description}</Typography>
      </Box>
      <Grid
        container
        spacing={1}
        wrap="nowrap"
        sx={{
          transition: "transform 0.6s ease-in-out",
        }}
      >
        {getVisibleImages().map((src, idx) => (
          <Grid key={idx} sx={{ flex: "0 0 auto", width: "20%" }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxHeight: 140,
                height: "auto",
                aspectRatio: "16/9",
              }}
            >
              <Image
                src={src}
                alt={`carousel-${idx}`}
                fill
                sizes="(max-width: 1200px) 20vw, 240px"
                style={{
                  objectFit: "contain", // Ensure full image shows
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrustBadges;
