import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';



import { AppContainer } from '@/components/layout/AppContainer';
import { ItemsCard, TagCard, SavedFilterCard } from "@/components/layout/ItemsCard"


export function Tags() {
  return (
    <AppContainer mw="md">
      <Box sx={{ flexGrow: 1, }}>
        <Grid container spacing={{ xs: 2, sm: 4, md: 8 }}>
          <Grid size={{ sm: 12, md: 4 }}> <TagCard /> </Grid>
          <Grid size={{ sm: 12, md: 4 }}> <SavedFilterCard /> </Grid>
          <Grid size={{ sm: 12, md: 4 }}> <ItemsCard /> </Grid>
        </Grid>
      </Box>
    </AppContainer >

  );
}
