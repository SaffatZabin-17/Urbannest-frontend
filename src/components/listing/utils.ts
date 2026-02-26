/**
 * Converts a SCREAMING_SNAKE or snake_case string into Title Case.
 * e.g. "SINGLE_FAMILY" → "Single Family"
 */
export function formatLabel(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
