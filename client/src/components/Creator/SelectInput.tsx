import { ChangeEventHandler } from 'react';
import { CreatorInput } from '../../types/Creator';

export const SelectInput = ({
  property: { name, isOptional, options },
  onChange,
}: {
  property: CreatorInput;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}): JSX.Element => (
  <select
    id={name}
    name={name}
    onChange={onChange}
    required={isOptional !== true}
    defaultValue=""
  >
    <option value="">--- None ---</option>
    {options?.map(([optionKey, optionValue]) => (
      <option key={optionKey} value={optionKey}>
        {optionValue}
      </option>
    ))}
  </select>
);
