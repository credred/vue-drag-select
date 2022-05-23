import { el, elBox, setupContainer } from '@test/_setup/setupContainer';
import { drag, pointerdown, pointerMove } from '@test/_utils/simulate';
import { addition, subtraction } from '@test/_utils/math';
import { useDragRect } from '@/hooks/useDragRect';
import { toRect } from '@/utils/toRect';
import { Position } from '@/typings/internal';

describe('hooks/useDragArea', () => {
  setupContainer();

  it('base usage', async () => {
    const { rect } = useDragRect(el);
    await drag(elBox.validArea.from, elBox.validArea.to, {
      onMove(pos) {
        expect(rect.value).toEqual(toRect(elBox.validArea.relativeFrom, elBox.relative(pos)));
      },
    });
  });

  it('rect should always be included by the paddingBox of el', async () => {
    const { rect } = useDragRect(el);
    // topLeft to bottomRight
    await drag(elBox.validArea.from, addition(elBox.validArea.to, [100, 100]), {
      onBeforeEnd() {
        expect(rect.value).toEqual(toRect(elBox.validArea.relativeFrom, elBox.validArea.relativeTo));
      },
    });
    
    // bottomRight to topLeft
    await drag(elBox.validArea.to, subtraction(elBox.validArea.from, [10, 10]), {
      onBeforeEnd() {
        expect(rect.value).toEqual(toRect(elBox.validArea.relativeTo, elBox.validArea.relativeFrom));
      },
    });
  });

  it('draggable area should be paddingBox', async () => {
    const { isDragging } = useDragRect(el);
    // border edge
    pointerdown(...subtraction<Position>(elBox.validArea.from, [elBox.borderLeft / 2, elBox.borderTop / 2]));
    pointerdown(...subtraction<Position>(elBox.validArea.from, [elBox.borderLeft / 2, elBox.borderTop / 2 + 1]));
    expect(isDragging.value).toBe(false);
    // paddingBox edge
    pointerdown(...addition<Position>(elBox.validArea.from, [elBox.paddingLeft / 2, elBox.paddingTop / 2]));
    pointerMove(...addition<Position>(elBox.validArea.from, [elBox.paddingLeft / 2, elBox.paddingTop / 2 + 1]));
    expect(isDragging.value).toBe(true);
  });
});
