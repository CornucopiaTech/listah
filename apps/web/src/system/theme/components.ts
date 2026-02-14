

export const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: "8px 20px",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
        "&:hover": {
          boxShadow: "0px 4px 10px rgba(0,0,0,0.08)"
          }
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)"
        }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)"
        }
    }
  }
}
