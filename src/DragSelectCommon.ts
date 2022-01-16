import { InjectionKey } from 'vue';
import { MaybeRef } from './typings/internal';

export interface DragSelectProps<T = unknown> {
  /**
   * binding value
   * @alias v-model
   */
  modelValue?: MaybeRef<T>;
  /**
   * whether DragSelect is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * can draggable when dragstart event target on DragSelectOption
   */
  draggableOnOption?: boolean;
  /**
   * the class names of drag area
   */
  dragAreaClass?: string;
  /**
   * the class styles of drag area
   */
  dragAreaStyle?: Record<string, unknown>;
  /**
   * background color of drag area, 'none' represent hide this style to avoid override background color of class
   */
  background?: string;
  /**
   * the class names of selected DragSelectOption
   */
  selectedOptionClass?: string;
  /**
   * the selected styles of selected DragSelectOption
   */
  selectedOptionStyle?: Record<string, unknown>;
}

export type InnerDragSelectProps<T = unknown> = DragSelectProps<T> & Required<Omit<DragSelectProps<T>, 'modelValue'>>;

export type OptionValue = unknown;

export interface Option<T = OptionValue> {
  dom: HTMLElement;
  value: T;
  disabled: boolean;
}

interface ForOptionAction {
  selectedOptionClass: MaybeRef<string>;
  has: (option: MaybeRef<Option>) => boolean;
  isSelected: (option: MaybeRef<Option>) => boolean;
  add: (option: MaybeRef<Option>) => void;
  delete: (option: MaybeRef<Option>) => void;
  onClick: (option: MaybeRef<Option>) => void;
  onPointerDown: () => void;
}

export const forOptionActionKey: InjectionKey<ForOptionAction> = Symbol();
