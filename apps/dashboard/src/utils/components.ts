export function handleInputChange(
  event: any,
  value: string | string[],
  onChange: any
) {
  value = event.target.value;

  if (typeof onChange === 'function') {
    onChange(event);
  }
}
