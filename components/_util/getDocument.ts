export const getDocument = (currentElement?: HTMLElement): Document | null => {
  if (typeof document === "undefined") {
    return null;
  } else {
    return currentElement && currentElement.ownerDocument ? currentElement.ownerDocument : document;
  }
};
