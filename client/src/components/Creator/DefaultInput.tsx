import { CreatorInput } from '../../types/Creator';

export const DefaultInput = ({
  property: { name, type, isOptional },
  value,
  setValue,
}: {
  property: CreatorInput;
  value: string;
  setValue: Function;
}): JSX.Element => (
  <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={({ target: { value: newValue } }) => {
      setValue(type === 'number' ? Number(newValue) : newValue);
    }}
    required={isOptional !== true}
  />
);
