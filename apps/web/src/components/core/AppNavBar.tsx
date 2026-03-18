
import type {
  SyntheticEvent,
  ReactNode
} from "react"
import {
  useState,
} from "react"
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { Show, SignInButton, UserButton } from '@clerk/react';
import { Icon } from "@iconify/react";
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';




import {
  AppH5ButtonTypography,
} from "@/components/core/ButtonTypography";
import {
  AppH4Typography,
  AppH5Typography,
} from "@/components/core/Typography";
import { AppBarHeight } from '@/lib/helper/defaults';
import type { AppTheme } from '@/lib/styles/theme';
import { SpaceAroundBox, SpaceBetweenBox } from "@/components/core/AppBox";



interface TabPanelProps {
  children?: ReactNode;
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

        <Show when="signed-out">
          <Tooltip title="Log in to your account" placement="bottom">
            <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 40, height: 40, }} variant="rounded">
              <Icon icon="material-symbols:login-rounded" width="40" height="40" />

            </Avatar>

          </Tooltip>
          <SignInButton>
            <AppH5ButtonTypography >
              Sign In
            </AppH5ButtonTypography>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
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
    event.stopPropagation();
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
    event.stopPropagation();
    setValue(newValue);
  };

  return (
    <SpaceBetweenBox sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', alignItems: 'center', alignContent: 'center', p: "0.51%" }}>
      <Link
        underline="none" key="home" href="/"
        sx={{ color: theme.palette.primary.contrastText, }}>

        <AppH4Typography>
          Listah
        </AppH4Typography>
      </Link>
      <SpaceAroundBox sx={{}}>

        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"  >
          <Tab
            label={
              <Link
                underline="none" key="home" href="/"
                sx={{ color: theme.palette.primary.contrastText, }}>
                <AppH5Typography sx={{ textTransform: "none" }}>
                  Home
                </AppH5Typography>
              </Link>
            } {...a11yProps(0)}
          />
          <Tab
            label={
              <Link
                underline="none" key="home" href="/tags"
                sx={{ color: theme.palette.primary.contrastText, }}>
                <AppH5Typography sx={{ textTransform: "none" }}>
                  Tags
                </AppH5Typography>
              </Link>
            } {...a11yProps(1)}
          />
          <Tab
            label={
              <Link
                underline="none" key="filters" href="/saved-filters"
                sx={{ color: theme.palette.primary.contrastText, }}>
                <AppH5Typography sx={{ textTransform: "none" }}>
                  Saved Filters
                </AppH5Typography>
              </Link>
            } {...a11yProps(2)}
          />
          <Tab
            label={
              <Link
                underline="none" key="items" href="/items"
                sx={{ color: theme.palette.primary.contrastText, }}>
                <AppH5Typography sx={{ textTransform: "none" }}>
                  Items
                </AppH5Typography>
              </Link>
            } {...a11yProps(3)}
          />
        </Tabs>
      </SpaceAroundBox>
    </SpaceBetweenBox>
  );
}
