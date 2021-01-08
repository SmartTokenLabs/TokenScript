import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import './Card.css';

function MediaCard({ title }) {
  return (
    <Card className="card">
      <CardContent>
        <Typography gutterBottom variant="h1" component="h1">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MediaCard;

