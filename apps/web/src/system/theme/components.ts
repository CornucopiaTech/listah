import { color } from "@/system/tokens/colors";
import { lightPalette } from "@/system/theme/palette";

export const components = {
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '1rem',
        color: color.tropicalteal["700"],
        '&.Mui-focused': { color: color.tropicalteal["500"] },
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
  },
  MuiButton: {
    // 1. ROOT OVERRIDES: Applies to ALL buttons (Text, Outlined, and Contained)
    styleOverrides: {
      root: {
        textTransform: 'none', // Prevents default ALL CAPS text
        borderRadius: '4px',   // Global custom rounding
        fontWeight: 600,        // Make button text slightly punchier
        padding: '8px 20px',    // Uniform padding
        boxShadow: 'none',      // Flat design style
        '&:hover': {
          boxShadow: 'none',    // Keep it flat on hover
        },
      },
      text: {
        backgroundColor: 'transparent',
        fontWeight: 600,
      },
      contained: {
        fontWeight: 500,
        color: lightPalette.primary.contrastText,
        '&.MuiButton-contained': {
          color: lightPalette.primary.contrastText, //  Guarantees victory over internal palette mappings
        },
      }
    },
    variants: [
      // 1. Success Contained Button
      {
        props: { variant: 'contained', color: 'success' },
        style: {
          color: lightPalette.success.contrastText,
          backgroundColor: lightPalette.success.main,
          '&:hover': {
            backgroundColor: lightPalette.success.dark,
          },
        },
      },
      // 2. Error Contained Button
      {
        props: { variant: 'contained', color: 'error' },
        style: {
          // color: lightPalette.error.contrastText,
          backgroundColor: lightPalette.error.main,
          '&:hover': {
            backgroundColor: lightPalette.error.dark,
          },
        },
      },
      // 3. Warning Contained Button
      {
        props: { variant: 'contained', color: 'warning' },
        style: {
          // color: lightPalette.warning.contrastText,
          backgroundColor: lightPalette.warning.main,
          '&:hover': {
            backgroundColor: lightPalette.warning.dark,
          },
        },
      },
      // 4. Default / Inherit Contained Button
      {
        props: { variant: 'contained', color: 'inherit' },
        style: {
          // color: lightPalette.primary.contrastText,
          backgroundColor: lightPalette.primary.main,
          '&:hover': {
            backgroundColor: lightPalette.primary.dark,
          },
        },
      },
      // 1b. Success Text Button
      {
        props: { variant: 'text', color: 'success' },
        style: {
          color: lightPalette.success.main,
          '&:hover': {
            color: lightPalette.success.dark,
          },
        },
      },
      // 2b. Error Text Button
      {
        props: { variant: 'text', color: 'error' },
        style: {
          color: lightPalette.error.main,
          '&:hover': {
            color: lightPalette.error.dark,
          },
        },
      },
      // 3b. Warning Text Button
      {
        props: { variant: 'text', color: 'warning' },
        style: {
          color: lightPalette.warning.main,
          '&:hover': {
            color: lightPalette.warning.dark,
          },
        },
      },
      // 4b. Default / Inherit Text Button
      {
        props: { variant: 'text', color: 'inherit' },
        style: {
          color: lightPalette.primary.main,
          '&:hover': {
            color: lightPalette.primary.dark,
          },
        },
      },
      // 100. Action / Inherit Button
      {
        props: { variant: 'action', color: 'inherit' },
        style: {
          display: 'flex', justifyContent: "flex-start", alignContent: "center", boxShadow: "none",
        },
      },
      // 100. Hero Contained / Inherit Button
      {
        props: { variant: 'heroContained', color: 'inherit' },
        // @ts-ignore
        style: ({ theme }) => ({
          display: 'flex',
          marginLeft: "auto",
          marginRight: "auto",
          width: "65%",
          justifyContent: "center", alignContent: "center", boxShadow: "none",
          color: lightPalette.primary.contrastText,
          backgroundColor: lightPalette.primary.main,
          '&:hover': {
            backgroundColor: lightPalette.primary.dark,
          },
          [theme.breakpoints.up('sm')]: {
            width: "100%",
          },
        }),
      },
    ],
  },
  MuiPaper: {
    variants: [
      // 1. Brand-new "glass" variant
      {
        props: { variant: 'glass' },
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        },
      },
      // 2. Brand-new "dashed" variant
      {
        props: { variant: 'dashed' },
        style: {
          backgroundColor: '#f4f7f6',
          border: '2px dashed #30706e',
          boxShadow: 'none',
        },
      },
      // 3. Brand-new "shaded" variant (subtle flat tinted background)
      {
        props: { variant: 'shaded' },
        style: {
          backgroundColor: '#eef3f2',
          border: 'none',
          boxShadow: 'none',
        },
      },
      // 4. hero
      {
        props: { variant: 'hero' },
        style: {
          backgroundColor: lightPalette.background.paper,
          // border: 'none',
          // boxShadow: 'none',
          height: "50vh",
          display: "flex",
          flexWrap: 'wrap',
          justifyContent: "center",
          alignContent: "center",
          marginTop: "10vh",
          marginBottom: "10vh",
          borderRadius: 8,
          padding: "8%",
        },
      },


    ],
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        padding: 0, margin: 0,
      },
    },
  },
  MuiChip: {
    // 1. ROOT OVERRIDES: Applies to ALL buttons (Text, Outlined, and Contained)
    styleOverrides: {
      root: {
        textTransform: 'none', // Prevents default ALL CAPS text
      },
      text: {
        backgroundColor: 'transparent',
        fontWeight: 600,
      },
      contained: {
        fontWeight: 500,
      }
    },
    variants: [
      // 1. Success Contained Chip
      {
        props: { variant: 'contained', color: 'success' },
        style: {
          color: lightPalette.success.contrastText,
          backgroundColor: lightPalette.success.main,
          '&:hover': {
            backgroundColor: lightPalette.success.dark,
          },
        },
      },
      // 2. Error Contained Chip
      {
        props: { variant: 'contained', color: 'error' },
        style: {
          color: lightPalette.error.contrastText,
          backgroundColor: lightPalette.error.main,
          '&:hover': {
            backgroundColor: lightPalette.error.dark,
          },
        },
      },
      // 3. Warning Contained Chip
      {
        props: { variant: 'contained', color: 'warning' },
        style: {
          color: lightPalette.warning.contrastText,
          backgroundColor: lightPalette.warning.main,
          '&:hover': {
            backgroundColor: lightPalette.warning.dark,
          },
        },
      },
      // 4. Default / Inherit Contained Chip
      {
        props: { variant: 'contained', color: 'inherit' },
        style: {
          color: lightPalette.primary.contrastText,
          backgroundColor: lightPalette.primary.main,
          '&:hover': {
            backgroundColor: lightPalette.primary.dark,
          },
        },
      },
      // 4. Default / Inherit Contained Chip
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          color: lightPalette.primary.contrastText,
          backgroundColor: lightPalette.primary.main,
          '&:hover': {
            backgroundColor: lightPalette.primary.dark,
          },
        },
      },
      // 4. Secondary Contained Chip
      {
        props: { variant: 'contained', color: 'secondary' },
        style: {
          color: lightPalette.secondary.contrastText,
          backgroundColor: lightPalette.secondary.main,
          '&:hover': {
            backgroundColor: lightPalette.secondary.dark,
          },
        },
      },
    ],
  },
  MuiAlert: {
    defaultProps: {
      icon: false,
    },
    styleOverrides: {
      // @ts-ignore
      root: ({ theme }) => ({
        // // Set your custom font size
        // fontSize: '1.1rem',
        // fontWeight: 500,
        // borderRadius: '8px',

        // // Optional: You can make the font size responsive across viewpoints
        // [theme.breakpoints.up('md')]: {
        //   fontSize: '1.25rem', // Slightly larger on desktop viewports
        // },
      }),
      message: {
        lineHeight: 1.6,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      // @ts-ignore
      root: ({ theme }) => ({
        '&.MuiDialogContent-root': {
          display: 'block',
          width: "sm",
          maxWidth: "sm",
          height: 'fit-content',
          maxHeight: '60vh',
          overflow: 'auto',
          margin: "0",
          '&::-webkit-scrollbar': {
            width: '15px', // width of the entire scrollbar
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.paper, // color of the tracking area
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.default, // color of the scroll thumb
            borderRadius: '10px', // roundness of the scroll thumb
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.background.default,
          },
        },
      }),
    },
    variants: [
      {
        props: { variant: 'form' },
        // @ts-ignore
        style: ({ theme }) => ({
          display: 'block',
          width: "sm",
          maxWidth: "sm",
          height: 'fit-content',
          maxHeight: '70vh',
          overflow: 'auto',
          margin: "0",
          '&::-webkit-scrollbar': {
            width: '15px', // width of the entire scrollbar
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.paper, // color of the tracking area
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.default, // color of the scroll thumb
            borderRadius: '10px', // roundness of the scroll thumb
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.background.default,
          },
        }),
      },
    ],
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        '&.MuiDialog-paper': {
          minWidth: '50vw',
          maxWidth: '80vw',
          height: 'fit-content',
          maxHeight: 'calc(100% - 100px)',
        },
      }
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        '&.MuiDialogTitle-root': {
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      },
    },
  },
  MuiSpeedDial: {
    styleOverrides: {
      root: {
        position: 'absolute', bottom: 0, right: 0,
        '& .MuiFab-primary': { width: 50, height: 50, minHeight: 50, }
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        p: -1, m: -1
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        p: -1, m: -1
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        // Whenever variant="poster" is used, render a semantic <h1> tag
        condensedBody2: 'h6',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-input': {
          fontSize: '1rem',
        }, // Changes the typed text size
        '& .MuiInputLabel-root': { fontSize: '1rem' }, // Changes the label size
      },
    },
  },
}
