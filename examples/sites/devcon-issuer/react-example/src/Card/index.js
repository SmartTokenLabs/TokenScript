import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
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

function MediaCard({ tokenInstance, selectVIPEventHandler }) {
  const classes = useStyles();
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="./mock.png"
          title="token"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {tokenInstance.token.ticketClass}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Ticket Id: {tokenInstance.token.ticketId}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Conference Id: {tokenInstance.token.conferenceId}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {tokenInstance.token.ticketClass === "VIP" &&
          <Button size="small" color="primary" onClick={e => selectVIPEventHandler({ ticket: tokenInstance })}>
            ENTER VIP
        </Button>
        }
      </CardActions>
    </Card>
  );
}

export default MediaCard;
