import { InjectionKey } from 'vue';
import { MaybeRef, OptionalKeys, RequiredKeys } from './typings/internal';

export type ModifierKey = 'meta' | 'shift' | 'ctrl' | 'alt';

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
  disabled?: MaybeRef<boolean>;
  /**
   * can draggable when dragstart event target on DragSelectOption
   */
  draggableOnOption?: MaybeRef<boolean>;
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
  /**
   * whether to keep the previously selected.
   * Only need to use when you need to manually control when to enable multiple selection, otherwise use activeMultipleKeys
   */
  multiple?: MaybeRef<boolean>;
  /**
   * after pressing a certain key, multiple mode will be activated
   */
  activeMultipleKeys?: MaybeRef<ModifierKey[]>;
  /**
   * in multiple mode, deselect options that are repeatedly selected
   */
  deselectRepeated?: MaybeRef<boolean>;
}

export type InnerDragSelectProps<I extends DragSelectProps, T> = {
  readonly [P in RequiredKeys<I>]-?: P extends keyof DragSelectProps ? NonNullable<DragSelectProps<T>[P]> : never;
} & {
  readonly [P in OptionalKeys<I>]?: P extends keyof DragSelectProps ? DragSelectProps<T>[P] : never;
};

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
