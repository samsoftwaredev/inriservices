"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Undo as UndoIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { SignatureData, SignatureMethod } from "./types";

interface SignaturePadProps {
  open: boolean;
  onClose: () => void;
  onAdopt: (data: SignatureData) => void;
  mode: "signature" | "initials";
  existingData?: SignatureData | null;
}

// ─── Draw Tab ──────────────────────────────────────────────────────
const DrawPad: React.FC<{
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClear: () => void;
  width: number;
  height: number;
}> = ({ canvasRef, onClear, width, height }) => {
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a237e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    isDrawing.current = false;
  };

  return (
    <Box>
      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 1,
          bgcolor: "#fafafa",
          cursor: "crosshair",
          touchAction: "none",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={width * 2}
          height={height * 2}
          style={{ width: "100%", height: height, display: "block" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#bbb",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Sign above
        </Typography>
      </Box>
      <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button size="small" startIcon={<DeleteIcon />} onClick={onClear}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

// ─── Type Tab ──────────────────────────────────────────────────────
const SIGNATURE_FONTS = [
  "'Brush Script MT', cursive",
  "'Georgia', serif",
  "'Segoe Script', cursive",
  "'Times New Roman', serif",
];

const TypePad: React.FC<{
  value: string;
  onChange: (val: string) => void;
  mode: "signature" | "initials";
}> = ({ value, onChange, mode }) => {
  const [fontIdx, setFontIdx] = useState(0);

  return (
    <Box>
      <TextField
        fullWidth
        placeholder={
          mode === "signature" ? "Type your full name" : "Type your initials"
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {SIGNATURE_FONTS.map((font, i) => (
          <Button
            key={i}
            variant={fontIdx === i ? "contained" : "outlined"}
            size="small"
            onClick={() => setFontIdx(i)}
            sx={{
              fontFamily: font,
              fontSize: mode === "signature" ? 20 : 18,
              textTransform: "none",
              minWidth: 80,
            }}
          >
            {value || (mode === "signature" ? "Preview" : "AB")}
          </Button>
        ))}
      </Box>
      {value && (
        <Box
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 1,
            textAlign: "center",
            bgcolor: "#fafafa",
          }}
        >
          <Typography
            sx={{
              fontFamily: SIGNATURE_FONTS[fontIdx],
              fontSize: mode === "signature" ? 36 : 28,
              color: "#1a237e",
            }}
          >
            {value}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ─── Main SignaturePad Component ───────────────────────────────────
const SignaturePad: React.FC<SignaturePadProps> = ({
  open,
  onClose,
  onAdopt,
  mode,
  existingData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tab, setTab] = useState<SignatureMethod>(
    existingData?.method || "draw",
  );
  const [typedText, setTypedText] = useState(existingData?.displayText || "");

  const canvasWidth = isMobile ? 300 : 500;
  const canvasHeight = mode === "signature" ? 160 : 100;

  useEffect(() => {
    if (open) {
      setTab(existingData?.method || "draw");
      setTypedText(existingData?.displayText || "");
    }
  }, [open, existingData]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const isCanvasEmpty = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return true;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 0) return false;
    }
    return true;
  };

  const handleAdopt = () => {
    if (tab === "draw") {
      const canvas = canvasRef.current;
      if (!canvas || isCanvasEmpty()) return;
      onAdopt({
        method: "draw",
        dataUrl: canvas.toDataURL("image/png"),
      });
    } else if (tab === "type") {
      if (!typedText.trim()) return;
      // Render typed text to canvas for uniform output
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasWidth * 2;
      tempCanvas.height = canvasHeight * 2;
      const ctx = tempCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.fillStyle = "#1a237e";
        ctx.font = `${mode === "signature" ? 60 : 44}px Georgia, serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedText, tempCanvas.width / 2, tempCanvas.height / 2);
      }
      onAdopt({
        method: "type",
        dataUrl: tempCanvas.toDataURL("image/png"),
        displayText: typedText,
      });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {mode === "signature"
          ? "Create Your Signature"
          : "Create Your Initials"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab value="draw" label="Draw" />
          <Tab value="type" label="Type" />
        </Tabs>

        {tab === "draw" && (
          <DrawPad
            canvasRef={canvasRef}
            onClear={clearCanvas}
            width={canvasWidth}
            height={canvasHeight}
          />
        )}

        {tab === "type" && (
          <TypePad value={typedText} onChange={setTypedText} mode={mode} />
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          By clicking &quot;Adopt and Sign&quot;, you agree that this{" "}
          {mode === "signature" ? "signature" : "initial"} will be the
          electronic representation applied to the document.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdopt}>
          Adopt and Sign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignaturePad;
