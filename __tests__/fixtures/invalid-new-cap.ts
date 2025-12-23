// Invalid: constructor should start with uppercase
function myClass() {
  return { value: 1 };
}

export const instance = new myClass();
