"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocumentIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { financialDocumentsApi } from "@/services/financialDocumentsApi";
import type { FinancialDocument, DocumentType } from "@/types";

interface ReceiptUploaderProps {
  transactionId: string | null; // null when creating a new transaction
  existingDocuments?: FinancialDocument[];
  onDocumentsChange?: (documents: FinancialDocument[]) => void;
  projectId?: string | null;
  vendorId?: string | null;
}

export default function ReceiptUploader({
  transactionId,
  existingDocuments = [],
  onDocumentsChange,
  projectId = null,
  vendorId = null,
}: ReceiptUploaderProps) {
  const [documents, setDocuments] =
    useState<FinancialDocument[]>(existingDocuments);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <DocumentIcon />;
    if (mimeType.startsWith("image/")) return <ImageIcon />;
    if (mimeType === "application/pdf") return <PdfIcon />;
    return <DocumentIcon />;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Build storage path
        const companyId = "company"; // In production, fetch from context/session
        const year = new Date().getFullYear();
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = transactionId
          ? `${companyId}/${year}/receipts/${transactionId}/${timestamp}-${safeName}`
          : `${companyId}/${year}/temp/${timestamp}-${safeName}`;

        const doc = await financialDocumentsApi.uploadAndCreate({
          file: file,
          file_name: file.name,
          file_path: filePath,
          document_type: "expense_receipt" as const,
          transaction_id: transactionId,
          project_id: projectId,
          vendor_id: vendorId,
          description: null,
        });

        return doc;
      });

      const newDocs = await Promise.all(uploadPromises);
      const updatedDocs = [...documents, ...newDocs];
      setDocuments(updatedDocs);

      if (onDocumentsChange) {
        onDocumentsChange(updatedDocs);
      }
    } catch (err) {
      console.error("Failed to upload files:", err);
      setError("Failed to upload one or more files. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    setError(null);
    try {
      await financialDocumentsApi.delete(docId);
      const updatedDocs = documents.filter((d) => d.id !== docId);
      setDocuments(updatedDocs);

      if (onDocumentsChange) {
        onDocumentsChange(updatedDocs);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError("Failed to delete document. Please try again.");
    }
  };

  const handlePreview = async (doc: FinancialDocument) => {
    try {
      const url = await financialDocumentsApi.getSignedUrl(doc.id, 300); // 5 min expiry
      setPreviewUrl(url);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Failed to load preview:", err);
      setError("Failed to load document preview.");
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={
            uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
          disabled={uploading}
          fullWidth
        >
          {uploading ? "Uploading..." : "Upload Receipt/Document"}
          <input
            type="file"
            hidden
            multiple
            accept="image/*,.pdf"
            onChange={handleFileSelect}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {documents.length === 0 ? (
        <Alert severity="info" icon={<AttachFileIcon />}>
          No documents attached yet.
        </Alert>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Attached Documents ({documents.length})
            </Typography>
            <List dense>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handlePreview(doc)}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(doc.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>{getFileIcon(doc.mime_type)}</ListItemIcon>
                  <ListItemText
                    primary={doc.file_name}
                    secondary={formatFileSize(doc.size_bytes)}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Document Preview
            <IconButton onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewUrl && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: 400,
              }}
            >
              {previewUrl.includes(".pdf") ? (
                <iframe
                  src={previewUrl}
                  style={{ width: "100%", height: "600px", border: "none" }}
                  title="Document Preview"
                />
              ) : (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={800}
                  height={600}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
