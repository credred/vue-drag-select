export const setIsEqual = (set1: Set<unknown>, set2: Set<unknown>) => {
  if (set1.size !== set2.size) {
    return false;
  }
  for (const value of set1) {
    if (!set2.has(value)) {
      return false;
    }
  }
  return true;
};
