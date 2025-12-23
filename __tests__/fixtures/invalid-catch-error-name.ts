// Invalid: catch error should be named 'error' not 'badName'
export function test() {
  try {
    throw new Error("test");
  } catch (badName) {
    console.log(badName);
  }
}
