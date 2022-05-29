export function strictEq(actual: unknown) {
  return {
    /*
     * The asymmetricMatch function is required, and must return a boolean.
     */
    asymmetricMatch: function (expected: unknown) {
      return Object.is(actual, expected);
    },

    /*
     * The jasmineToString method is used in the Jasmine pretty printer. Its
     * return value will be seen by the user in the message when a test fails.
     */
    jasmineToString: function () {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `<strictEq: ${actual}>`;
    },
  };
}
