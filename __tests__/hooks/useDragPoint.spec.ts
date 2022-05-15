import { useDragPoints } from '@/hooks/useDragPoints';
import { el, elBox, makeContainerScrollable, setupContainer } from '@test/_setup/setupContainer';
import { drag } from '@test/_utils/simulate';
import { addition } from '@test/_utils/math';

describe('hooks/useDragPoint', () => {
  setupContainer();

  it('base usage', async () => {
    const { fromPoint, toPoint, isDragging } = useDragPoints(el);
    await drag(elBox.validArea.from, elBox.validArea.to, {
      onStart() {
        expect(isDragging.value).toEqual(true);
        expect(fromPoint.value).toEqual(elBox.validArea.relativeFrom);
      },
      onMove(pos) {
        expect(toPoint.value).toEqual(elBox.relative(pos));
      },
      onBeforeEnd() {},
      onEnd() {
        expect(isDragging.value).toEqual(false);
      },
    });
  });

  it('point should be correctly even if el has scrolled', async () => {
    makeContainerScrollable();
    const scrollLeft = (el.scrollLeft = 50);
    const scrollTop = (el.scrollTop = 50);
    const { toPoint } = useDragPoints(el);
    await drag(elBox.validArea.from, elBox.validArea.to, {
      onMove(pos) {
        expect(toPoint.value).toEqual(addition(elBox.relative(pos), [scrollLeft, scrollTop]));
      },
    });
  });
});
