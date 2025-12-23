// Invalid: using spread in reduce accumulator is slow (O(n²))
const items = [1, 2, 3, 4, 5];

const result = items.reduce((acc, item) => {
    return [...acc, item * 2];
}, [] as number[]);

export { result };
