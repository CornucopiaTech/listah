import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";

import { NewItemFab } from '@/components/core/NewItemFab';
import { FilterFab } from '@/components/core/FilterFab';


export function HomeFab() {
  return (
    <Box sx={{ position: "fixed", bottom: 26, right: 6, zIndex: 1000 }} >
      <Stack spacing={2}>
        <NewItemFab />
        <FilterFab />
      </Stack>
    </Box>
  );
}
