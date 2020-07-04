import { getDocument } from "./getDocument";

/**
 * mark element is scrollable to avoid expensive operation getComputedStyle
 */
export const DATA_IS_SCROLLABLE = "data-is-scrollable";

export const findScrollableParent = (el: HTMLElement) => {
  const doc = getDocument(el);
  if (doc === null) {
    return null;
  }
  let resultEl: HTMLElement | null = el;
  while (resultEl && resultEl !== doc.body) {
    if (resultEl.getAttribute(DATA_IS_SCROLLABLE) === "true") {
      return resultEl;
    }
    resultEl = resultEl.parentElement;
  }

  resultEl = el;
  while (resultEl && resultEl !== doc.body) {
    if (resultEl.getAttribute(DATA_IS_SCROLLABLE) !== "false") {
      const elComputedStyle = window.getComputedStyle(resultEl);
      const overflowStyle = elComputedStyle.getPropertyValue("overflow");
      if (overflowStyle.includes("auto") || overflowStyle.includes("scroll")) {
        return resultEl;
      }
    }
    resultEl = resultEl.parentElement;
  }
  return doc.body;
};
