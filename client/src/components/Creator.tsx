import { useState } from 'react';

type CreatorProps = {
  onSubmit: Function;
  onCancel: Function;
  properties: Array<{
    name: string;
    label: string;
    type: string;
  }>;
};
const Creator = ({
  onSubmit,
  onCancel,
  properties,
}: CreatorProps): JSX.Element => {
  const defaultObject = properties.reduce(
    (acc, { name }) => ({ ...acc, [name]: '' }),
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
