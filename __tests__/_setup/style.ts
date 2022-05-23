import { Position } from '@/typings/internal';
import variable from '@test/_setup/variable.module.scss';

export const dragSelectBox = {
  margin: +variable.dragSelectMargin,
  border: +variable.dragSelectBorder,
  gap: +variable.dragSelectGap,
  width: +variable.dragSelectWidth,

  optionWidth: +variable.dragSelectOptionWidth,
  optionHeight: +variable.dragSelectOptionHeight,

  optionCount: 9,
  getOptionPosition(idx: number): Position {
    const [row, col] = [Math.floor(idx / 3), idx % 3];
    return [
      dragSelectBox.margin + dragSelectBox.border + dragSelectBox.gap * col + col * dragSelectBox.optionWidth,
      dragSelectBox.margin + dragSelectBox.border + dragSelectBox.gap * row + row * dragSelectBox.optionHeight,
    ];
  },
};
