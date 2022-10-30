import { ChangeEventHandler, HTMLInputTypeAttribute, useState } from 'react';

export type CreatorInput = {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  defaultValue?: any;
  isOptional?: boolean;
  options?: [key: string, value: string][];
};

const DefaultInput = ({
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

const CheckboxInput = ({
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

const SelectInput = ({
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
  >
    {isOptional && <option value="">---None---</option>}
    {options?.map(([optionKey, optionValue]) => (
      <option key={optionKey} value={optionValue}>
        {optionValue}
      </option>
    ))}
  </select>
);

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
