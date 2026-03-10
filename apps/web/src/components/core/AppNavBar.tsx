
import type {
  SyntheticEvent,
} from "react"


import {
  useState,
} from "react"



import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react';
import { Icon } from "@iconify/react";
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';




import {
  AppH4ButtonTypography,
  AppH5ButtonTypography,
  AppH6ButtonTypography,
} from "@/components/core/ButtonTypography";
import { AppBarHeight } from '@/lib/helper/defaults';
import type { AppTheme } from '@/lib/styles/theme';
import { SpaceAroundBox, SpaceBetweenBox } from "@/components/core/AppBox";
import { transform } from "zod";



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function AppNavBar() {
  const theme: AppTheme = useTheme();
  return (
    <AppBar position="static"
        sx={{
          bgcolor: theme.palette.primary.light, width: '100%', height: AppBarHeight,
        }}
      elevation={1}
      >
      <Toolbar sx={{
          justifyContent: 'space-between', alignContent: 'center', alignItems: 'center',
          display: 'flex', flexWrap: 'wrap', width: '100%', p: "1%"
        }}>
        <Link
          underline="hover" key="home" href="/"
          sx={{ color: theme.palette.primary.contrastText, p: 0, m: 0, display: 'flex', alignItems: 'center', }}>

          <AppH5ButtonTypography>
            {/* <img src="/logo.png" width={42} height={50} /> */}
            Listah
          </AppH5ButtonTypography>
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <Tooltip title="Log in to your account" placement="bottom">
              <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 40, height: 40, }} variant="rounded">
                <Icon icon="material-symbols:login-rounded" width="40" height="40" />
              </Avatar>
            </Tooltip>
            {/* <Typography variant="h6" noWrap component="div">
              Sign In
            </Typography> */}
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export function PrevAppTabNavBar() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}


export function AppTabNavBar() {
  const theme: AppTheme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <SpaceBetweenBox sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', alignItems: 'center', alignContent: 'center', p: "0.51%"}}>
      <Link
        underline="hover" key="home" href="/"
        sx={{ color: theme.palette.primary.contrastText,}}>

        <AppH4ButtonTypography>
          Listah
        </AppH4ButtonTypography>
      </Link>
      <SpaceAroundBox sx={{ }}>

        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"  >
          <Tab
            label={
              <AppH5ButtonTypography sx={{ display: 'inline-flex', textTransform: 'none' }}>
                Tags
              </AppH5ButtonTypography>
            } {...a11yProps(0)}
          />
          <Tab
            label={
              <AppH5ButtonTypography sx={{ display: 'inline-flex', textTransform: 'none' }}>
                Saved Filters
              </AppH5ButtonTypography>
            } {...a11yProps(1)}
          />
          <Tab
            label={
              <AppH5ButtonTypography sx={{ display: 'inline-flex', textTransform: 'none' }}>
                Items
              </AppH5ButtonTypography>
            } {...a11yProps(2)}
          />
          </Tabs>
      </SpaceAroundBox>
    </SpaceBetweenBox>
  );
}
