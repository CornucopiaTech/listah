import { color } from "@/system/tokens/colors";

export const components = {
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '1rem',
        color: color.tropicalteal["700"],
        '&.Mui-focused': { color: color.lobsterpink["500"] },
        '&.Mui-error': { color: '#d32f2f' },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        fontSize: '1rem',
      },
    },
  },
  MuiSnackbar: {
    styleOverrides: {
      root: {
        '&.MuiSnackbar-root': {
          position: 'absolute', //relative to parent stack
          top: '0',        // exact pixel position
          left: '0',
          right: 'auto',
          bottom: 'auto',
        }
      }
    }
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: {
        '& .MuiSnackbarContent-root': {
          minWidth: '400px',   // override MUI's default minWidth
          maxWidth: '600px',
          width: '100%',
          padding: '16px 24px',  // increases vertical/horizontal size
        }
      }
    },
    message: {
      '& .MuiSnackbarContent-message': {
        fontSize: '1.1rem',
        fontWeight: 500,
      }
    },
    action: {
      '& .MuiSnackbarContent-action': {
        fontSize: '0.875rem',
      }
    },
  }

  // MuiButton: {
  //   // defaultProps: {
  //   //   variant: "contained",
  //   //   color: color.teagreen.main,
  //   //   // size: "",
  //   //   disableElevation: true,
  //   //   // disableRipple: false,
  //   //   // fullWidth: false
  //   // },
  //   styleOverrides: {
  //     root: {
  //       variant: "contained",
  //       color: color.teagreen.main,
  //       disableElevation: true,
  //       borderRadius: 1,
  //       padding: "8px 20px",
  //       boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
  //       "&:hover": {
  //         boxShadow: "0px 4px 10px rgba(0,0,0,0.08)"
  //         }
  //     }
  //   }
  // },
  // MuiPaper: {
  //   styleOverrides: {
  //     root: {
  //       borderRadius: 16,
  //       boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
  //       color: "green",
  //     }
  //   }
  // },
  // MuiCard: {
  //   styleOverrides: {
  //     root: {
  //       borderRadius: 16,
  //       boxShadow: "0px 4px 12px rgba(0,0,0,0.06)"
  //       }
  //   }
  // }
}
