import { watch, unref } from 'vue';
import { Option } from './DragSelectCommon';
import { useDragRect } from './hooks/useDragRect';
import { MaybeNullableRef, MaybeRef } from './typings/internal';
import { rectIsIntersect } from './utils/rectIsIntersect';
import { setIsEqual } from './utils/setIsEqual';

interface UseDragToSelectConfig {
  contentRef: MaybeNullableRef<HTMLElement>;
  options: Set<Option>;
  currentSelectedOptions: MaybeRef<Set<unknown>>;
  onChange: (selectedOptions: Set<unknown>) => void;
}

export function useDragToSelect({ contentRef, options, currentSelectedOptions, onChange }: UseDragToSelectConfig) {
  const { rect: areaRect, style: areaStyle } = useDragRect(contentRef);

  watch(areaRect, () => {
    const newSelectedOptions = new Set();
    if (!areaRect.value) return;
    for (const { dom, value } of options) {
      if (
        rectIsIntersect(areaRect.value, {
          left: dom.offsetLeft,
          top: dom.offsetTop,
          width: dom.clientWidth,
          height: dom.clientHeight,
        })
      ) {
        newSelectedOptions.add(value);
      }
    }
    if (!setIsEqual(newSelectedOptions, unref(currentSelectedOptions))) {
      onChange(newSelectedOptions);
    }
  });

  return areaStyle;
}

interface UseClickToSelectConfig {
  currentSelectedOptions: MaybeRef<Set<unknown>>;
  onChange: (selectedOptions: Set<unknown>) => void;
}

export function useClickToSelect({ currentSelectedOptions, onChange }: UseClickToSelectConfig) {
  const onClickToSelect = (option: Option) => {
    const newSelectedOptions = new Set([option.value]);
    if (!setIsEqual(newSelectedOptions, unref(currentSelectedOptions))) {
      onChange(newSelectedOptions);
    }
  };

  return onClickToSelect;
}
