import React, { useReducer } from "react";
import DatePicker from './../DatePicker';

const BookingDate = () => {

  // Form state.
  const [formInput, setFormInput] = useReducer((state, newState) => ({ ...state, ...newState }), { reference: "" });

  // Handle date change input
  const handleInput = evt => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '80%' }}>
        <div style={{ margin: '10px' }}>
          <DatePicker
            name={'from'}
            label={'from'}
            handleInput={handleInput}
            date={today}
          />
        </div>
        <div style={{ margin: '10px' }}>
          <DatePicker
            name={'to'}
            label={'to'}
            handleInput={handleInput}
            date={tomorrow}
          />
        </div>
      </div>
    </div>
  );
}

export default BookingDate;