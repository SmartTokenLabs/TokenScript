import React, { useReducer } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from './../DatePicker';
import TokenCard from './../TokenCard';
import './BookingModal.css';

// BOOKING MODAL COMPONENT
// Booking form

export default function BookingModal({ roomType, applyDiscount, discount, price, tokens, book }) {

  // Modal State (open boolean).
  const [open, setOpen] = React.useState(false);

  // Form state.
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), { reference: "", from: "", to: "" });

  // Handle form input.
  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  // Simple validation check.
  const formIsValid = () => {
    return !(
      (formInput.reference.length > 0) &&
      (formInput.from instanceof Date) &&
      (formInput.to instanceof Date)
    );
  }

  // handle form submission.
  const handleSubmit = evt => {
    evt.preventDefault();
    book(formInput);
  };

  // Open Modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close Modal
  const handleClose = () => {
    setOpen(false);
  };

  const discountValue = discount.value ? price * discount.value / 100 : 0;
  const viewPrice = price - discountValue;

  return (
    <div>
      <Button size="small" color="primary" onClick={handleClickOpen}>
        Book
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="title" disableTypography={true}>
          {roomType}
        </DialogTitle>
        <DialogTitle className="subTitle" disableTypography={true}>
          {viewPrice} ETH per night.
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="booking-name"
              label="Booking Reference Name"
              type="text"
              fullWidth
              name="reference"
              onChange={handleInput}
            />
            <DatePicker
              name={'from'}
              label={'from'}
              handleInput={handleInput}
            />
            <DatePicker
              name={'to'}
              label={'to'}
              handleInput={handleInput}
            />
            {tokens.length > 0 &&
              <p className="smallCopy">Select a ticket to apply discount:</p>
            }
            {tokens &&
              tokens.map((token, index) => {
                return <TokenCard key={index} applyDiscount={applyDiscount} tokenInstance={token} discount={discount}></TokenCard>
              })
            }
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={formIsValid()}>
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
