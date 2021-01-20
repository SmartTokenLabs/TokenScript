import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import './logoCard.css';

// LOGO CARD COMPONENT
// Simply shows the Hotel title

function MediaCard({ title }) {
  return (
    <Card className="logoCard">
      <CardContent>
        <Typography gutterBottom variant="h1" component="h1">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MediaCard;

