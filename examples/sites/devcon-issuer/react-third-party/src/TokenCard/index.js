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

  // tokenInstance:
  // {
  //  devconId: 6n
  //  ticketClass: 1n
  //  ticketId: 222n
  // }

  const isSelectedToken = (discount.tokenInstance && discount.tokenInstance.ticketClass === tokenInstance.ticketClass);
  return (
    <Card className={isSelectedToken ? 'tokenCard selected' : 'tokenCard'}>
      <CardActionArea>
        <div>
          <CardMedia
            className={classes.media}
            image="./mock.png"
            title="token"
          />
          {tokenInstance && tokenInstance.ticketClass.toString() &&
            <CardContent onClick={e => applyDiscount(isSelectedToken ? null : tokenInstance)}>
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
          }
        </div>
      </CardActionArea>
    </Card >
  );
}

export default TokenCard;
