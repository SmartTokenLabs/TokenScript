import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import './TokenCard.css';

// Considering how we can use loading animation
// import Skeleton from '@material-ui/lab/Skeleton';
{/* <Skeleton variant="rect" width={216} height={64} /> */ }

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 3,
  },
});

function MediaCard({ tokensNumber }) {
  const classes = useStyles();
  return (
    <Zoom in={true} style={{ transitionDelay: true ? '500ms' : '0ms' }}>
      <Card className="tokenCard">
        <CardContent>
          <Typography gutterBottom variant="h1" component="h1">
            {tokensNumber} Devcon Tickets found
          </Typography>
          <Typography gutterBottom variant="body1" component="p" style={{ fontSize: '0.75rem' }}>
            booking discounts available
          </Typography>
        </CardContent>
        <CardMedia
          className={classes.media}
          image="./mock.png"
          title="token"
        />
      </Card>
    </Zoom>
  );
}

export default MediaCard;

