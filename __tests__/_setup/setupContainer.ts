export let el!: HTMLDivElement;

export const elBox = {
  marginTop: 10,
  marginLeft: 20,
  borderTop: 10,
  borderLeft: 20,
  paddingTop: 10,
  paddingLeft: 20,
  height: 100,
  width: 200,
  scrollWidth: 300,
  scrollHeight: 300,
  get validArea() {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + el.clientTop,
      right: rect.left + rect.width - el.clientLeft,
      bottom: rect.top + rect.height - el.clientTop,
      left: rect.left + el.clientLeft,
    };
  }
};

export function setupContainer() {
  beforeEach(() => {
    el = document.createElement('div');
    el.id = 'root';
    el.style.height = `${elBox.height}px`;
    el.style.width = `${elBox.width}px`;
    el.style.margin = `${elBox.marginTop}px ${elBox.marginLeft}px`;
    el.style.borderWidth = `${elBox.borderTop}px ${elBox.borderLeft}px`;
    el.style.borderStyle = `solid`;
    el.style.border = `${elBox.borderTop}px ${elBox.borderLeft}px solid`;
    el.style.padding = `${elBox.paddingTop}px ${elBox.paddingLeft}px`;
    el.style.overflow = 'auto';
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
    //@ts-ignore
    el = undefined;
  });

  return el;
}

export function makeContainerScrollable() {
  const child = document.createElement('div');
  child.style.width = '300px';
  child.style.height = '300px';
  el.appendChild(child);
}