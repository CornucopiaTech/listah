import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface GlobalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // The dynamic body content
  actions?: React.ReactNode;  // Optional custom actions override
  hideDefaultActions?: boolean;
}

export const GlobalDialog: React.FC<GlobalDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  hideDefaultActions = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '450px', // Combines our previous min-width logic globally
        },
      }} >
      {/* 1. GLOBALLY STATIC HEADER */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc', // Global header styling
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="h6" component="span" fontWeight="600">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* 2. DYNAMIC CONTENT AREA */}
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>

      {/* 3. GLOBALLY STATIC ACTIONS FOOTER */}
      {!hideDefaultActions && (
        <DialogActions
          sx={{
            p: 2,
            backgroundColor: '#f8fafc', // Global footer styling
            borderTop: '1px solid #e2e8f0',
            gap: 1,
          }}
        >
          {/* If custom actions are passed, render them. Otherwise, fallback to a global default */}
          {actions ? (
            actions
          ) : (
            <>
              <button onClick={onClose} style={{ padding: '6px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={onClose} style={{ padding: '6px 16px', borderRadius: '4px', background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Confirm
              </button>
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
