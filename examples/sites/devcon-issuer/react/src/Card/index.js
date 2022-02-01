import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import './Card.css';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

function MediaCard({ tokenInstance }) {
  const classes = useStyles();
  return (
    <Card className="card">
      <CardMedia
        className={classes.media}
        image="./mock.png"
        title="token"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {tokenInstance.ticketClass.toString()}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Ticket Id: {tokenInstance.ticketId.toString()}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Devcon Id: {tokenInstance.devconId.toString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MediaCard;
