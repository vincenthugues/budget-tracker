import { useState } from 'react';
import { CreatorInput } from '../../types/Creator';
import { CheckboxInput } from './CheckboxInput';
import { DefaultInput } from './DefaultInput';
import { SelectInput } from './SelectInput';

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
    [key: string]: number | string | boolean;
  }>(defaultObject);

  const filterOutEmptyStrings = (formObject: object) =>
    Object.fromEntries(
      Object.entries(formObject).filter(([_, value]) => value !== '')
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filterOutEmptyStrings(objectToCreate));
      }}
    >
      {properties.map((property) => (
        <div key={property.name}>
          <label htmlFor={property.name}>{property.label}</label>
          {property.options ? (
            <SelectInput
              property={property}
              onChange={({ target: { value } }) => {
                setObjectToCreate({
                  ...objectToCreate,
                  [property.name]: value,
                });
              }}
            />
          ) : property.type === 'checkbox' ? (
            <CheckboxInput
              property={property}
              value={objectToCreate[property.name].toString()}
              setValue={(newValue: boolean) => {
                setObjectToCreate({
                  ...objectToCreate,
                  [property.name]: newValue,
                });
              }}
            />
          ) : (
            <DefaultInput
              property={property}
              value={objectToCreate[property.name].toString()}
              setValue={(newValue: any) => {
                setObjectToCreate({
                  ...objectToCreate,
                  [property.name]: newValue,
                });
              }}
            />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
      <button
        type="button"
        onClick={() => {
          onCancel();
        }}
      >
        Cancel
      </button>
    </form>
  );
};

export default Creator;
