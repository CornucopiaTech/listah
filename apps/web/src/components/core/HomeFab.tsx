import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Stack from "@mui/material/Stack";

import { NewItemFab } from '@/components/core/NewItemFab';


export function HomeFab() {
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }} >
      <Stack spacing={2}>
        <NewItemFab />
      </Stack>
    </Box>
  );
}
