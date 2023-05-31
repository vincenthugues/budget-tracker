import { HTMLInputTypeAttribute } from 'react';

export type CreatorInput = {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  defaultValue?: any;
  isOptional?: boolean;
  options?: [key: string, value: string][];
  // valueTransformer?: <Type>(arg: Type) => Type;
};
