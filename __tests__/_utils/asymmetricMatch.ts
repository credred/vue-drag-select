export function strictEq(actual: any) {
  return {
    /*
     * The asymmetricMatch function is required, and must return a boolean.
     */
    asymmetricMatch: function (expected: any) {
      return Object.is(actual, expected);
    },

    /*
     * The jasmineToString method is used in the Jasmine pretty printer. Its
     * return value will be seen by the user in the message when a test fails.
     */
    jasmineToString: function () {
      return '<strictEq: ' + actual + '>';
    },
  };
}
