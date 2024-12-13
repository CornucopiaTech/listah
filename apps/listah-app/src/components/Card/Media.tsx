import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import CardButton from '../Button/Card';

import { CardHeadingTypography, CardContentTypography } from '../Typography/Card';



export default function MediaCard(props) {
	const cardActions = props.cardActions.map((item) => (
		<CardButton key={item} label={item} />
	));

  console.log(props.imageHeight);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: parseInt(props.imageHeight) }}
        image={props.imageUrl}
        title={props.imageTitle}
      />
      <CardContent>
        <CardHeadingTypography content={props.cardHeading} />
        <CardContentTypography content={props.cardContent} />
      </CardContent>
      <CardActions>{cardActions}</CardActions>
    </Card>
  );
}


export function ImgMediaCard(props) {
	const cardActions = props.cardActions.map((item) => (
		<CardButton key={item} label={item} />
	));

  return (
    <Card sx={{ maxWidth: 345 }}>
       <CardActionArea href={props.cardMainAction}>
        <CardMedia
          component="img"
          alt={props.imageAltText}
          height={props.imageHeight}
          image={props.imageUrl}
        />
        <CardContent>
          <CardHeadingTypography content={props.cardHeading} />
          <CardContentTypography content={props.cardContent} />
        </CardContent>
       </CardActionArea>

      <CardActions>
        {cardActions}
      </CardActions>
    </Card>
  );
}
