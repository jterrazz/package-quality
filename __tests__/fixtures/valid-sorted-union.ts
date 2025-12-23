// Valid: union types are sorted alphabetically
type Status = 'active' | 'completed' | 'error' | 'pending';

export function getStatus(): Status {
    return 'active';
}
