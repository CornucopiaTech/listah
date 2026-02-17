import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Stack from "@mui/material/Stack";


export function ItemsFab() {
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }} >
      <Stack spacing={2}>
        <Fab color="primary"> <AddIcon /> </Fab>
        <Fab color="secondary"> <EditIcon /> </Fab>
      </Stack>
    </Box>
  );
}
