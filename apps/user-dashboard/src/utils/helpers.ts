import { educationItems, subjectItems, typeItems } from './static';

export function ConvertType(value: string) {
  const item = typeItems.find((type) => type.value === value);
  if (!item) return value;
  return item.label;
}

export function ConvertSbj(value: string) {
  const item = subjectItems.find((type) => type.value === value);
  if (!item) return value;
  return item.label;
}

export function ConvertEdu(value: string) {
  const item = educationItems.find((type) => type.value === value);
  if (!item) return value;
  return item.label;
}
