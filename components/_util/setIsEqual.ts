// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setIsEqual = (set1: Set<any>, set2: Set<any>) => {
  if (set1.size !== set2.size) {
    return false;
  }
  const set2ForDiff = new Set(set2);
  for (const value of set1) {
    if (!set2ForDiff.has(value)) {
      return false;
    } else {
      set2ForDiff.delete(value);
    }
  }
  return set2ForDiff.size === 0;
};
