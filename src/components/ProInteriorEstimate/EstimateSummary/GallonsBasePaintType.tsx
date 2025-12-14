"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useGallons } from "@/context/GallonsContext";
import { calculatePaintGallons, convertToFeet } from "@/tools";

export const GallonsBasePaintType = ({
  roomFeature,
}: {
  roomFeature?: string;
}) => {
  const { totalGallonsByBasePaint, measurementUnit } = useGallons();

  const paintData =
    totalGallonsByBasePaint[
      roomFeature as keyof typeof totalGallonsByBasePaint
    ];

  if (
    !roomFeature ||
    !paintData ||
    paintData.reduce((acc, curr) => acc + curr.totalPerimeter, 0) === 0
  ) {
    return null;
  }

  return (
    <Typography variant="body2">
      {paintData.map(({ paintBase, totalPerimeter }, index) => {
        const isSquared = roomFeature === "ceiling" || roomFeature === "floor";
        const gallons = calculatePaintGallons(
          totalPerimeter,
          1,
          measurementUnit,
          1,
          isSquared
        );
        const feet = convertToFeet(
          totalPerimeter,
          measurementUnit,
          isSquared
        ).toFixed(2);

        return (
          <span key={index}>
            {paintBase}: {gallons}g. ({feet}ft.)
            {index < paintData.length - 1 && ", "}
          </span>
        );
      })}
    </Typography>
  );
};
