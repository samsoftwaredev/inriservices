import { useState } from "react";
import { Box, Typography, Badge, Tooltip, TextField } from "@mui/material";

interface LegoBlock {
  id: string;
  name: string;
  sku: string;
}

interface Props {
  legoBlocks: LegoBlock[];
  label: string;
}

const SelectionSKUBlock = ({ legoBlocks, label }: Props) => {
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleBlockClick = (id: string) => {
    setSelectedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredBlocks = legoBlocks.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        {label}
      </Typography>
      {/* Search Box */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name or SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Counter Badge in top right corner */}
      {selectedBlocks.size > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            zIndex: 10,
          }}
        >
          <Badge
            badgeContent={selectedBlocks.size}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "1rem",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
              },
            }}
          />
        </Box>
      )}

      {/* Lego Blocks in a row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "nowrap",
          overflowX: "auto",
          paddingTop: 2,
          paddingBottom: 2,
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: 4,
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        {filteredBlocks.map((block) => {
          const isSelected = selectedBlocks.has(block.id);
          return (
            <Tooltip key={block.id} title={`SKU: ${block.sku}`} arrow>
              <Box
                onClick={() => handleBlockClick(block.id)}
                sx={{
                  height: 100,
                  minWidth: 250,
                  border: isSelected ? "3px solid #1976d2" : "2px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 3,
                    borderColor: "#1976d2",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: isSelected ? "bold" : "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {block.name}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default SelectionSKUBlock;
