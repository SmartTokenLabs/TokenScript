import React, { useState } from "react";
import DatePicker from './../DatePicker';

const BookingDate = () => {

  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Form state.
  const [formInput, setFormInput] = useState({
    from: today,
    to: tomorrow
  });

  // Handle date change input
  const handleInput = (newValue, label) => {
    setFormInput({ [label]: newValue });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '80%' }}>
        <div style={{ margin: '10px' }}>
          <DatePicker
            name={'from'}
            label={'from'}
            handleInput={handleInput}
            date={formInput.from}
          />
        </div>
        <div style={{ margin: '10px' }}>
          <DatePicker
            name={'to'}
            label={'to'}
            handleInput={handleInput}
            date={formInput.to}
          />
        </div>
      </div>
    </div>
  );
}

export default BookingDate;