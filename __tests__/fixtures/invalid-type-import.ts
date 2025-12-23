// Invalid: should use type import for type-only imports
import { SomeType } from './types';

export function process(input: SomeType): string {
    return String(input);
}
