import { useRef, useState } from "react";
import {
  Box,
  Typography,
  Badge,
  Tooltip,
  TextField,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getSKULabels } from "@/tools/searchSKU";

interface LegoBlock {
  id: string;
  name: string;
  sku: string;
}

interface Props {
  legoBlocks: LegoBlock[];
  label: string;
  legoType?: "drywall" | "painting"; // Optional prop to differentiate types if needed
}

const SelectionSKUBlock = ({
  legoBlocks,
  label,
  legoType = "painting",
}: Props) => {
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

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
      <Typography variant="h6" sx={{ mt: 3 }}>
        {label}
      </Typography>
      {/* Search Box */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name or SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Lego Blocks in a row with scroll arrows */}
      <Box sx={{ position: "relative" }}>
        {/* Left Arrow */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 11,
            backgroundColor: "#fff",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Right Arrow */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 11,
            backgroundColor: "#fff",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <ChevronRight />
        </IconButton>

        {/* Scrollable Container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            flexWrap: "nowrap",
            overflowX: "auto",
            paddingTop: 2,
            px: 1,
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
              <Tooltip key={block.id} title={block.sku} arrow>
                <Box
                  onClick={() => handleBlockClick(block.id)}
                  sx={{
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
                  <Typography
                    variant="caption"
                    sx={{
                      marginTop: 1,
                      color: "#666",
                    }}
                  >
                    {getSKULabels(block.sku, legoType)}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default SelectionSKUBlock;
