import React from 'react';

const Select = ({ options, onChange, value, placeholder }) => {
  return (
    <select value={value} onChange={onChange}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option, index) => (
        <option value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;