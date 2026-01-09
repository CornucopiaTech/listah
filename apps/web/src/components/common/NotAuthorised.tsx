import type {ReactNode} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { SignInButton, SignUpButton, } from '@clerk/clerk-react';


export default function NotAuthorised(): ReactNode {
  const theme: object = useTheme();
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
        401
      </Typography>
      <Typography variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        Unauthorised
      </Typography>
      <Typography variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
        You are not authorised to view this content.
      </Typography>
      <Typography variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
        Please sign in or sign up.
      </Typography>
      <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
          }}
        >
        <SignInButton mode="modal">
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
              Sign In
            </Typography>
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
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
            Sign Up
          </Typography>
          </Button>
        </SignUpButton>
      </Box>
    </Box>
  );
}
