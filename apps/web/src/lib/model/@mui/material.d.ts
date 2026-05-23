import '@mui/material/styles';
import '@mui/material/Paper';
import '@mui/material/Chip';
import '@mui/material/DialogContent';
import '@mui/material/DialogTitle';




declare module '@mui/material/styles' {
  interface Palette {
    muted: Palette['primary'];
  }
  interface PaletteOptions {
    muted?: Palette['primary'];
  }


  interface TypographyVariants {
    condensedBody2: React.CSSProperties;
  }

  // Allows configuration inside createTheme()
  interface TypographyVariantsOptions {
    condensedBody2?: React.CSSProperties;
  }

  interface ButtonPropsVariantOverrides {
    action: true;
    heroContained: true;
  }


  interface ChipPropsVariantOverrides {
    contained: true;
  }

};

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    condensedBody2: true;
  }
}


declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    glass: true;
    dashed: true;
    shaded: true;
    hero: true;
  }
}



declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    contained: true;
  }
  interface ChipProps {
    // 1. Add a custom boolean prop
    color?: 'success' | 'info' | 'warning' | 'inherit' | 'secondary' | 'primary';
  }
}



declare module '@mui/material/DialogContent' {
  interface DialogContentPropsVariantOverrides {
    form: true;
  }
}

declare module '@mui/material/DialogTitle' {
  interface DialogTitlePropsVariantOverrides {
    accent: true;
  }
}
