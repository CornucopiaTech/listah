import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Stack from "@mui/material/Stack";

import { NewItemFab } from '@/components/core/NewItemFab';

export function ItemsFab() {
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }} >
      <Stack spacing={2}>
        <NewItemFab />
        <Fab color="secondary"> <EditIcon /> </Fab>
      </Stack>
    </Box>
  );
}
