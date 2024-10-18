import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard(props) {
	const cardActions = props.cardActions.map((item) => (
		<Button size="small">{item}</Button>
	));
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={props.imageUrl}
        title={props.imageTitle}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.cardHeading}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {props.cardContent}
        </Typography>
      </CardContent>
      <CardActions>
        {cardActions}
      </CardActions>
    </Card>
  );
}
