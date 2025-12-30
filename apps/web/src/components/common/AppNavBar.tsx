

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';



import { AppBarHeight } from '@/lib/model/appNavBarModel';



export default function AppNavBar() {
  const theme: {} = useTheme();
  const drawerinfo: { name: string, href: string, tip: string }[] = [
    { name: 'Listah', href: '/', tip: 'Go to Listah home' },
    { name: 'Items', href: '/items/read', tip: 'View all items' },
    { name: 'Tags', href: '/tags/read', tip: 'View all tags' },
    { name: 'Categories', href: '/categories/read', tip: 'View all categories' },
    { name: 'Settings', href: '/settings', tip: 'View app settings' },
  ];

  return (
    <AppBar sx={{ bgcolor: theme.palette.primary.main, width: '100%', height: AppBarHeight,}}>
      <Toolbar>
          <Box  sx={{
                  justifyContent: 'space-between',
                  display: 'flex', width: '100%',
                }}>
            {
              drawerinfo.map((item) => (
                <Tooltip key={item.name} title={item.tip}>
                  <Link key={item.name} href={item.href}
                    style={{ color: theme.palette.primary.contrastText, }}>
                    <Typography variant="h6" noWrap component="div"> {item.name}</Typography>
                  </Link>
                </Tooltip>
              ))
            }
          </Box>
      </Toolbar>
    </AppBar>
  );
}
