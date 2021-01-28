import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import './TokenNotificationCard.css';

// TOKEN NOTIFICATION CARD COMPONENT
// To show a discount is available to Devcon ticket holders.

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 3,
  },
});

function TokenNotificationCard({ tokensNumber }) {
  const classes = useStyles();
  return (
    <Zoom in={true} style={{ transitionDelay: true ? '500ms' : '0ms' }}>
      <Card className="tokenNotificationCard">
        <CardContent>
          <Typography
            gutterBottom
            variant="h1"
            component="h1"
          >
            {tokensNumber} Devcon Tickets found
          </Typography>
          <Typography
            gutterBottom
            variant="body1"
            component="p"
          >
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

export default TokenNotificationCard;

