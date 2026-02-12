import type { ReactNode } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import type { AppTheme } from '@/lib/styles/theme';

export default function NotFound(): ReactNode {
  const theme: AppTheme = useTheme();
  return (
      <Box sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: theme.palette.primary.main,  //"#1a202c"
        }}>
      <Typography variant="h1"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        404
      </Typography>
      <Typography variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        Not Found
      </Typography>
      <Typography variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: 2,
          }}
        >
        <Link href="/" underline="none">
          <Button
            variant="text"
              sx={{ my: 2, }}
            >
            <Typography
              variant="h3" noWrap
              component="div"
              sx={{
                color: theme.palette.containedButton.main,
                textTransform: 'none',
              }}
            >
              Go Home
            </Typography>
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
