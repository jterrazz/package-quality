// Invalid: using default export instead of named export
function greet(name: string): string {
  return `Hello ${name}`;
}

export default greet;
