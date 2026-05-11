import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6750A4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#EAD8FF",
    },
    background: {
      default: "#1c1b1f",
      paper: "#fffbfe",
    },
    text: {
      primary: "#1c1b1f",
      secondary: "#49454f",
    },
  },
  typography: {
    fontFamily: "'Google Sans', 'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 28,
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          padding: "8px 0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
          fontWeight: 500,
          fontSize: 14,
          letterSpacing: "0.01em",
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          borderRadius: 16,
          width: 56,
          height: 56,
          backgroundColor: "#6750A4",
          "&:hover": {
            backgroundColor: "#7965af",
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          backgroundColor: "#EAD8FF",
          color: "#6750A4",
          "&:hover": {
            backgroundColor: "#d8b8ff",
          },
        },
        staticTooltipLabel: {
          backgroundColor: "#f7f2fa",
          color: "#49454f",
          border: "1px solid #e8def8",
          borderRadius: 12,
          fontSize: 12,
          fontFamily: "'Google Sans', 'Roboto', sans-serif",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          whiteSpace: "nowrap",
        },
      },
    },
  },
});

const speedDialActions = [
  { icon: <ShareIcon sx={{ color: "#6750A4" }} />, name: "Share link" },
  { icon: <PictureAsPdfIcon sx={{ color: "#6750A4" }} />, name: "Export PDF" },
  { icon: <CloudUploadIcon sx={{ color: "#6750A4" }} />, name: "Save to cloud" },
];

interface SaveDocumentDialogProps {
  open: boolean;
  onClose: () => void;
}

function SaveDocumentDialog({ open, onClose }: SaveDocumentDialogProps) {
  const [dialOpen, setDialOpen] = useState(false);

  const handleClose = () => {
    setDialOpen(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="save-dialog-title"
    >
      <DialogTitle
        id="save-dialog-title"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          pb: 1,
          pt: 2,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: 18, color: "text.primary" }}>
            Save document
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Choose how you'd like to save your changes.
          </Typography>
        </Box>
        <IconButton
          aria-label="close dialog"
          onClick={handleClose}
          size="small"
          sx={{
            ml: 1,
            mt: -0.5,
            color: "text.secondary",
            "&:hover": { backgroundColor: "rgba(103, 80, 164, 0.08)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, pb: 0 }}>
        <DialogContentText sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
          Your document has unsaved changes. Select a destination or action below to continue.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pt: 2, pb: 1, justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={handleClose} color="primary" variant="text">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary" variant="contained" disableElevation>
          Save
        </Button>
      </DialogActions>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: 3,
          pb: 3,
          pt: 1,
          minHeight: 80,
          position: "relative",
        }}
      >
        <SpeedDial
          ariaLabel="More save options"
          icon={<SpeedDialIcon />}
          open={dialOpen}
          onOpen={() => setDialOpen(true)}
          onClose={() => setDialOpen(false)}
          direction="up"
          sx={{
            position: "absolute",
            bottom: 24,
            right: 24,
          }}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => {
                setDialOpen(false);
              }}
            />
          ))}
        </SpeedDial>
      </Box>
    </Dialog>
  );
}

export default function App() {
  const [open, setOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!open && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 20, textTransform: "none" }}
          >
            Open dialog
          </Button>
        )}
        <SaveDocumentDialog open={open} onClose={() => setOpen(false)} />
      </Box>
    </ThemeProvider>
  );
}
