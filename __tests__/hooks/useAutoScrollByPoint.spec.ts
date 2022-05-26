import useAutoScrollByPoint from '@/hooks/useAutoScrollByPoint';
import { Position } from '@/typings/internal';
import { el, elBox, setupContainer, makeContainerScrollable } from '@test/_setup/setupContainer';

describe('useAutoScrollByPoint hook', () => {
  setupContainer();
  beforeEach(() => {
    makeContainerScrollable();
  });

  it('should auto scroll if the point are outside el', (done) => {
    expect(el.scrollLeft).toBe(0);
    expect(el.scrollTop).toBe(0);

    const rightBottom: Position = [elBox.validArea.right + 10, elBox.validArea.bottom + 10];
    useAutoScrollByPoint(el, true, rightBottom, {
      onEnd() {
        expect(el.scrollLeft).toBe(el.scrollWidth - el.clientWidth);
        expect(el.scrollTop).toBe(el.scrollHeight - el.clientHeight);
        done();
      },
    });
  });
});
