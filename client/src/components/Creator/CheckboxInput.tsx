import { CreatorInput } from '../../types/Creator';

export const CheckboxInput = ({
  property: { name, isOptional },
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
    type="checkbox"
    value={value}
    onChange={({ target: { value: checked } }) => {
      setValue(checked);
    }}
    required={isOptional !== true}
  />
);
