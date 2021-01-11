import React from "react";
import Card from './../Card';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function TemporaryDrawer({ tokens, applyDiscount }) {
  const [state, setState] = React.useState({ right: false });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const applyDiscountDrawer = (ticket) => {
    setState({ state: { right: false } });
    applyDiscount(ticket);
  }
  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button style={{ margin: "12px" }} variant="contained" color="secondary" onClick={toggleDrawer(anchor, true)}>
            Apply Discount
          </Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <Typography style={{ margin: "28px" }} className="discountCopyContainer" gutterBottom variant="body2" component="p">
              Choose ticket:
              </Typography>
            {tokens.length > 0 && tokens.map((tokenInstance, index) => {
              return <Card key={index} tokenInstance={tokenInstance} applyDiscount={applyDiscountDrawer} />
            })
            }
            <Typography style={{ margin: "28px" }} className="applyDiscountCopyContainer" gutterBottom variant="body2" component="p"></Typography>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}