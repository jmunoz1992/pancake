import React from 'react';
import styled from 'styled-components';

export const Textbox = props => {
  return (
    <div>
      <span>Textbox Label</span>
      <input placeholder="Textbox" />
    </div>
  );
};
Textbox.TYPE = 'forms/textbox';

export const Checkbox = props => {
  return (
    <div>
      <input type="checkbox" />
      <label>Checkbox Label</label>
    </div>
  );
};
Checkbox.TYPE = 'forms/checkbox';

export const Button = props => {
  return (
    <div>
      <input type="button" value="Button" />
    </div>
  );
};
Button.TYPE = 'forms/button';
