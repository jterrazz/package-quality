// Invalid: nested ternary expressions
export function getStatus(value: number): string {
  return value > 10 ? value > 20 ? 'high' : 'medium' : 'low';
}
