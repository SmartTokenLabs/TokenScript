import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import './Card.css';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 3,
  },
});

function MediaCard({ tokenInstance, applyDiscount }) {
  const classes = useStyles();
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="./mock.png"
          title="token"
        />
        <CardContent onClick={e => applyDiscount(tokenInstance)}>
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
      </CardActionArea>
    </Card>
  );
}

export default MediaCard;
