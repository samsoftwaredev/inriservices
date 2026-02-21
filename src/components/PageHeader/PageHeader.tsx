"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  onBack,
  actions,
}: PageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Stack mb={1}>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {typeof onBack === "function" && (
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Stack>
          <>
            <Typography
              variant="h4"
              gutterBottom={!!subtitle}
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
                mb: subtitle ? { xs: 0.5, md: 1 } : 0,
                wordBreak: "break-word",
              }}
            >
              {icon && (
                <Box
                  sx={{
                    mr: { xs: 1, sm: 1.5, md: 2 },
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: 32, sm: 36, md: 40 },
                    "& > *": {
                      fontSize: "inherit",
                    },
                  }}
                >
                  {icon}
                </Box>
              )}
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </>
        </Stack>

        {actions && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: "center" },
              "& > *": {
                flex: { xs: 1, sm: "initial" },
              },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default PageHeader;
