import { HTMLInputTypeAttribute, useState } from 'react';

export type CreatorInput = {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  defaultValue?: any;
};

type CreatorProps = {
  onSubmit: Function;
  onCancel: Function;
  properties: CreatorInput[];
};
const Creator = ({
  onSubmit,
  onCancel,
  properties,
}: CreatorProps): JSX.Element => {
  const defaultObject = properties.reduce(
    (acc, { name, defaultValue }) => ({ ...acc, [name]: defaultValue ?? '' }),
    {}
  );
  const [objectToCreate, setObjectToCreate] = useState<{
    [key: string]: number | string;
  }>(defaultObject);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(objectToCreate);
      }}
    >
      {properties.map(({ name, label, type }) => (
        <div key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type={type}
            value={objectToCreate[name]}
            onChange={({ target: { value } }) =>
              setObjectToCreate({ ...objectToCreate, [name]: value })
            }
            required
          />
        </div>
      ))}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel()}>
        Cancel
      </button>
    </form>
  );
};

export default Creator;
