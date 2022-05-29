export function subtraction<T extends number[]>(arr1: T, arr2: T): T {
  const result = [] as number[] as T;
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] - arr2[i]);
  }

  return result;
}

export function addition<T extends number[]>(arr1: T, arr2: T): T {
  const result = [] as number[] as T;
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] + arr2[i]);
  }

  return result;
}
