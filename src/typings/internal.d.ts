import { Ref } from 'vue';

export type Fn = () => void;

export type MaybeRef<T> = T | Ref<T>;

export type MaybeNullableRef<T> = T | Ref<T | null | undefined>;

export type PointerType = 'mouse' | 'touch' | 'pen';

export type Position = [x: number, y: number];

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type RequiredKeys<T> = keyof {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

export type OptionalKeys<T> = keyof {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};
