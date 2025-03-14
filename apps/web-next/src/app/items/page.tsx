import Box from '@mui/material/Box';


import { AppNavBar } from '@/components/AppNavBar';
import { ItemsView } from '@/components/ItemsView';

export default function Item() {
  return (
    <Box sx={{ bgcolor: 'pink', height: '100vh'}}>
      <AppNavBar/>
      <ItemsView />
    </Box>
  );
}
