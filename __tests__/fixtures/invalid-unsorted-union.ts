// Invalid: union types should be sorted alphabetically
type Status = 'pending' | 'error' | 'active' | 'completed';

export function getStatus(): Status {
    return 'active';
}
