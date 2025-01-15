
import {
    Fragment
} from 'react';
import {
    CssBaseline,
    Box,
    Container,
    Typography,
    Grid2 as Grid
} from '@mui/material';


// Application Custom Components
import { AppNavBar } from '../components/AppNavBar';
import { ItemFilter } from './itemFilter';
import { ItemSort } from './itemSort';
import { ItemListing } from './itemListing';

export function ItemsPage() {
  return (
    <Fragment>
        <CssBaseline />
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', width: '100%' }}>
            <AppNavBar />
            <Box  component="main"
                  sx={{
                      flexGrow: 1, flexWrap: 'wrap', width: '100%',
                      height: '100%', display: 'block', bgcolor: '#7F4FD4',
                      }}>
                    <Box sx={{
                              flexGrow: 1, display: 'flex',
                              width: '100%', height: '100%',
                              bgcolor: 'pink', justifyContent: 'center',
                              alignItems: 'center', pt: 6, px: 3,
                            }}>
                        {/* Page heading with title, sorting and filers*/}
                        <Typography variant="h6"
                                    gutterBottom
                                    sx={{
                                          justifyContent: 'flex-start',
                                          alignContent: 'flex-start', pt:4,
                                        }}>
                            Items
                        </Typography>
                        <Box  sx={{
                                justifyContent: 'flex-end',
                                flexGrow: 1, display: 'flex', pt:4,
                              }}>
                            <ItemFilter/>
                            <ItemSort />
                        </Box>
                    </Box>
                    <Grid   container
                            spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
                            columns={{ xs: 2, sm: 6, md: 12 }}>
                        <ItemListing />
                        {/* <ItemDetails /> */}
                    </Grid>
            </Box>
          </Box>
      </Container>
    </Fragment>
  );
}
