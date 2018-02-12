import bristle, {createPath, renderToCanvas, renderToSvg} from "../src/bristle";

const movePoint = [0, 0];
const linePoint = [3, 2];
const quadControlPoint = [5, 5];
const quadPoint = [6, 2];

describe('Bristle export sanity checks', () => {
  it('should export createPath as a function', () => {
    expect(typeof createPath).toBe('function');
  });
  it('should export renderToCanvas as a function', () => {
    expect(typeof renderToCanvas).toBe('function');
  });
  it('should export renderToSvg', () => {
    expect(typeof renderToSvg).toBe('function');
  });
  it('should export all individual exports on the default export object', () => {
    expect(bristle.createPath).toBe(createPath);
    expect(bristle.renderToCanvas).toBe(renderToCanvas);
    expect(bristle.renderToSvg).toBe(renderToSvg);
  });
});