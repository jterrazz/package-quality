// Valid: await in loop should be allowed (no-await-in-loop disabled)
async function processItems(items: string[]) {
  const results: string[] = [];
  for (const item of items) {
    const result = await Promise.resolve(item);
    results.push(result);
  }
  return results;
}

export { processItems };
