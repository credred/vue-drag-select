import { afterTest } from './afterTest';

export const mockFn = jest.fn();

afterTest(() => {
  mockFn.mockClear();
});
