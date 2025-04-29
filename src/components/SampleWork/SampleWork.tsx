"use client";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SampleWork = () => {
  const imagesLength = 16;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imagesLength - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagesLength - 1 : prevIndex - 1
    );
  };

  return (
    <Box
      component="section"
      sx={{
        my: { xs: 2, md: 4 },
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        component="h3"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        What We Can Do for You
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        Take a look at some of the incredible transformations. We bring your
        vision to life with precision and care.
      </Typography>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {(() => {
            const items = [];
            for (let index = 0; index < imagesLength; index++) {
              items.push(
                <Box
                  key={index}
                  component="img"
                  src={`/sampleWork/painting${index + 1}.jpg`}
                  alt={"Sample Work"}
                  sx={{
                    width: "100%",
                    height: "auto",
                    flexShrink: 0,
                    objectFit: "cover",
                  }}
                />
              );
            }
            return items;
          })()}
        </Box>
        <Box
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            cursor: "pointer",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))",
            color: "white",
          }}
        >
          <ArrowBackIosNewIcon />
        </Box>
        <Box
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            cursor: "pointer",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))",
            color: "white",
          }}
        >
          <ArrowForwardIosIcon />
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        {(() => {
          const items = [];
          for (let index = 0; index < imagesLength; index++) {
            items.push(
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  mx: 0.5,
                  borderRadius: "50%",
                  backgroundColor:
                    currentIndex === index ? "primary.main" : "grey.400",
                  cursor: "pointer",
                }}
              />
            );
          }
          return items;
        })()}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          component="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            mb: 2,
          }}
        >
          Our Services
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            textAlign: "left",
          }}
        >
          {[
            {
              title: "Trim Repair and Installation",
              description:
                "Enhance your home's aesthetics with professional trim repair and installation services.",
              emoji: "🪚",
            },
            {
              title: "Cabinet Painting",
              description:
                "Revitalize your kitchen or bathroom with a fresh coat of paint on your cabinets.",
              emoji: "🎨",
            },
            {
              title: "ReTexture Walls",
              description:
                "Transform your walls with modern textures for a stylish and updated look.",
              emoji: "🖌️",
            },
            {
              title: "Interior Painting",
              description:
                "Refresh your living spaces with high-quality interior painting services.",
              emoji: "🏠",
            },
            {
              title: "Exterior Painting",
              description:
                "Boost your home's curb appeal with durable and vibrant exterior painting.",
              emoji: "🌳",
            },
            {
              title: "Wallpaper Removal",
              description:
                "Remove outdated wallpaper to prepare your walls for a new look.",
              emoji: "🧹",
            },
            {
              title: "Popcorn Ceiling Removal",
              description:
                "Modernize your ceilings by removing old popcorn textures for a smooth finish.",
              emoji: "🪜",
            },
            {
              title: "Deck Staining and Sealing",
              description:
                "Protect and beautify your deck with expert staining and sealing services.",
              emoji: "🌞",
            },
            {
              title: "Drywall Installation",
              description:
                "Ensure a flawless finish with professional drywall installation and repair.",
              emoji: "🔧",
            },
            {
              title: "Pressure Washing",
              description:
                "Clean and restore your home's exterior surfaces with powerful pressure washing.",
              emoji: "💦",
            },
          ].map((service, index) => (
            <Box
              key={index}
              component="li"
              sx={{
                backgroundColor: "background.paper",
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Typography
                variant="h6"
                component="h5"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  mb: 1,
                }}
              >
                {service.emoji} {service.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.875rem" }}
              >
                {service.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SampleWork;
