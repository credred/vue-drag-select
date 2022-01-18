type Method = () => void;

const cbs: Method[] = [];

export function afterTest(method: Method): void {
  cbs.push(method);
}

afterEach(() => {
  cbs.forEach((cb) => cb());
  cbs.length = 0;
});
