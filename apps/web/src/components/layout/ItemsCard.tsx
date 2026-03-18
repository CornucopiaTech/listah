

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';



import {
  AppH4Typography,
  AppH5Typography,
  AppBody1Typography,
  AppBody2Typography,
} from "@/components/core/Typography";

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export function ItemsCard() {
  return (
    <Card sx={{ width: { sm: "100%", md: '100%' }, minWidth: 275 }}>
      <CardContent>
        <AppH4Typography sx={{ color: 'text.secondary', }}>
          Items
        </AppH4Typography>
        <AppH5Typography>
          be{bull}nev{bull}o{bull}lent
        </AppH5Typography>
        <AppBody2Typography >adjective</AppBody2Typography>
        <AppBody1Typography >
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </AppBody1Typography>
      </CardContent>
      <CardActions>
        <Button size="small"><AppBody1Typography> Learn More </AppBody1Typography></Button>
      </CardActions>
    </Card>
  );
}

export function TagCard() {
  return (
    <Card sx={{ width: { sm: "100%", md: '100%' }, minWidth: 275 }}>
      <CardContent>
        <AppH4Typography sx={{ color: 'text.secondary', }}>
          Tags
        </AppH4Typography>
        <AppH5Typography>
          be{bull}nev{bull}o{bull}lent
        </AppH5Typography>
        <AppBody2Typography >adjective</AppBody2Typography>
        <AppBody1Typography >
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </AppBody1Typography>
      </CardContent>
      <CardActions>
        <Button size="small"><AppBody1Typography> Learn More </AppBody1Typography></Button>
      </CardActions>
    </Card>
  );
}

export function SavedFilterCard() {
  return (
    <Card sx={{ width: { sm: "100%", md: '100%' }, minWidth: 275 }}>
      <CardContent>
        <AppH4Typography sx={{ color: 'text.secondary', }}>
          Saved Filters
        </AppH4Typography>
        <AppBody2Typography sx={{ textTransform: "none", display: "div" }}> Learn More </AppBody2Typography>
        <AppBody2Typography >Create new filter category</AppBody2Typography>
        <AppBody2Typography >Update existing filter category</AppBody2Typography>
        <AppBody2Typography >View items by filter category</AppBody2Typography>
      </CardContent>
      <CardActions>
        <Button size="small">
          <AppBody2Typography sx={{ textTransform: "none", display: "div" }}> Learn More </AppBody2Typography>
          <AppBody2Typography >Create new filter category</AppBody2Typography>
          <AppBody2Typography >Update existing filter category</AppBody2Typography>
          <AppBody2Typography >View items by filter category</AppBody2Typography>
        </Button>
      </CardActions>
    </Card>
  );
}
