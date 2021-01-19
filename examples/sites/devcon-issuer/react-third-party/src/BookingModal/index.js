import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from './../DatePicker';
import Card from './../Card';

export default function FormDialog({ roomType, applyDiscount, discountValue, price, tokens }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const viewPrice = discountValue ? (price / discountValue).toFixed(5) : price;

  return (
    <div>
      <Button size="small" color="primary" onClick={handleClickOpen}>
        Book
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" style={{ fontSize: "1.5rem", marginBottom: "12px", paddingBottom: 0 }} disableTypography="false">
          {roomType}
        </DialogTitle>
        <DialogTitle id="form-dialog-title" style={{ fontSize: "0.8rem", margin: 0, paddingTop: 0 }} disableTypography="false">
          {discountValue ? 'Discount' : 'Standard'} price of {viewPrice} ETH per night.
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="booking-name"
            label="Your Booking Name"
            type="text"
            fullWidth
          />
          <DatePicker label={'from'} />
          <DatePicker label={'to'} />
          {tokens &&
            <p>Select a ticket to apply discount:</p>
          }
          {tokens &&
            tokens.map((token, index) => {
              return <Card key={index} applyDiscount={applyDiscount} tokenInstance={token}></Card>
            })
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
