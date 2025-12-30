// Valid: lowercase constructor should be allowed (new-cap disabled)
function myConstructor() {
  return { value: 1 };
}

const instance = new myConstructor();

export { instance };
