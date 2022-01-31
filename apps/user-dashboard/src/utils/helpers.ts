import { Subjects } from '@labmaker/shared';
import { educationItems, subjectItems, typeItems } from './static';

export const ConvertType = (value: string) => {
  const item = typeItems.find((type) => type.value === value);
  if (!item) return value;
  return item.label;
};

export const ConvertSbj = (value: string) => {
  const item = subjectItems.find((type) => type.value === value);
  if (!item) return value;
  return item.label;
};

export const ConvertEdu = (value: string) => {
  const item = educationItems.find((type) => type.value === value);
  if (!item) return value;
  return item.label;
};

export const getServerId = () => {
  const id = process.env.NX_SERVER_ID;
  if (!id) throw Error('Unable to find Discord ID');
  return id;
};

export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
  myEnum: T,
  enumValue: string
): keyof T | null {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
}
