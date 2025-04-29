"use client";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

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
            left: 16,
            transform: "translateY(-50%)",
            cursor: "pointer",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {"<"}
        </Box>
        <Box
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
            cursor: "pointer",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {">"}
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
    </Box>
  );
};

export default SampleWork;
