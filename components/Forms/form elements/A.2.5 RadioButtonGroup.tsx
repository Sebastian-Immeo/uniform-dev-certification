'use client';

import { ComponentProps, registerUniformComponent } from '@uniformdev//canvas-react';
import { useState } from 'react';
import RadioButton from './A.2.6 RadioButton';

export interface OptionField {
  _id?: string;
  type?: string;
  fields: {
    label: {
      type: string;
      value: string;
    };
    value: {
      type: string;
      value: string;
    };
    default?: {
      type: string;
      value: boolean;
    };
  };
}

interface RadioButtonGroupProps {
  isDarkMode: boolean;
  label: string;
  options: OptionField[];
  onChange?: (value: string) => void;
  required?: boolean;
  width?: 'full' | 'half';
}

const RadioButtonGroup = ({
  label,
  isDarkMode,
  options,
  onChange,
  required,
  width,
  component,
}: ComponentProps<RadioButtonGroupProps>) => {
  const defaultValue =
    options.find((option) => option.fields.default?.value)?.fields.value
      .value ||
    options[0]?.fields?.value?.value ||
    '';

  const [selected, setSelected] = useState(defaultValue);

  const isDark = component?.variant === 'dark' || isDarkMode;
  const labelColor = isDark ? 'text-platinum' : 'text-carbon';

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className={`${width}`}>
      <div style={{ display: 'none' }}>
        {options.map((option) => (
          <input
            key={option.fields.value.value}
            type="radio"
            name={label}
            value={option.fields.value.value}
            checked={selected === option.fields.value.value}
            onChange={() => {}} // Controlled by visible radio buttons
            required={required}
          />
        ))}
      </div>

      <fieldset className="space-y-4">
        <legend className={`${labelColor} text-label mb-ft-3`}>{label}</legend>
        {options.map((option) => (
          <RadioButton
            key={option.fields.value.value}
            label={option.fields.label.value}
            isDarkMode={isDark}
            checked={selected === option.fields.value.value}
            onChange={() => handleSelect(option.fields.value.value)}
          />
        ))}
      </fieldset>
    </div>
  );
};

registerUniformComponent({
  type: 'radioButtonGroup',
  component: RadioButtonGroup,
});

export default RadioButtonGroup;
