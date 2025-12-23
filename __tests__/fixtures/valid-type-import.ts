// Valid: uses type import for type-only imports
import type { SomeType } from './types';

export function process(input: SomeType): string {
    return String(input);
}
