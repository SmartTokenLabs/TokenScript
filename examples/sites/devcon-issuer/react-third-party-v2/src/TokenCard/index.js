import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import './TokenCard.css';

const useStyles = makeStyles({
  root: {},
  media: {
    height: 5,
  },
});

function TokenCard({ tokenInstance, applyDiscount, discount }) {
  const classes = useStyles();
  return (
    <Card className={discount.tokenInstance && discount.tokenInstance.ticketClass === tokenInstance.ticketClass ? 'tokenCard selected' : 'tokenCard'}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="./mock.png"
          title="token"
        />
        <CardContent onClick={e => applyDiscount(tokenInstance)}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
          >
            {tokenInstance.ticketClass.toString()}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          >
            Ticket Id: {tokenInstance.ticketId.toString()}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          >
            Devcon Id: {tokenInstance.devconId.toString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card >
  );
}

export default TokenCard;
