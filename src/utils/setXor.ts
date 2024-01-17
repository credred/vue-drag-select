// Define a function that takes two Sets as parameters and returns their xor set
export const setXor = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  // Create a new Set to store the result
  const resultSet = new Set<T>();
  // Iterate over each element in setA
  for (const value of setA) {
    // If setB does not contain the element, add it to the result set
    if (!setB.has(value)) {
      resultSet.add(value);
    }
  }
  // Iterate over each element in setB
  for (const value of setB) {
    // If setA does not contain the element, add it to the result set
    if (!setA.has(value)) {
      resultSet.add(value);
    }
  }
  // Return the result set
  return resultSet;
};
