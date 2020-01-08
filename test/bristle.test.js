import { mat2d } from 'gl-matrix';
import bristle from "../src/bristle";
import mockContext2d from './mockContext2d';

describe('bristle', () => {
  it('should return a function', () => {
    const drawPath = bristle({ ctx2d: {} });

    expect(typeof drawPath).toBe('function');
  });
  it('should throw an error if no context2d object is provided and outputToString is not enabled', () => {
    expect(bristle).toThrow(Error);
  });
  it('should handle drawing commands', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    drawPath(pathCtx => {
      pathCtx
        .moveTo([0, -5])
        .pathTo([5, 8])
        .controlAt([10, 10])
        .pathTo([15, 8])
        .controlAt([20, 4])
        .controlAt([20, -4])
        .pathTo([10, -8]);
    });

    expect(ctx2d.savedInstructions)
      .toEqual([
        ['move', [0, -5]],
        ['line', [5, 8]],
        ['quad', [10, 10, 15, 8]],
        ['bezier', [20, 4, 20, -4, 10, -8]],
      ]);
  });
  it('should handle short drawing commands', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    drawPath(pathCtx => {
      pathCtx
        .m([0, -5])
        .p([5, 8])
        .c([10, 10])
        .p([15, 8])
        .c([20, 4])
        .c([20, -4])
        .p([10, -8]);
    });

    expect(ctx2d.savedInstructions)
      .toEqual([
        ['move', [0, -5]],
        ['line', [5, 8]],
        ['quad', [10, 10, 15, 8]],
        ['bezier', [20, 4, 20, -4, 10, -8]],
      ]);
  });
  it('should throw an error if 3 control points are used before a path command', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    drawPath(pathCtx => {
      expect(() => pathCtx.controlAt([1, 2]).controlAt([2, 3]).controlAt([3, 3]))
        .toThrow(Error);
    });
  });
  it('should transform the points with the provided transform matrix', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    drawPath(pathCtx => {
        pathCtx.moveTo([0, 10]);
      }, mat2d.fromTranslation(mat2d.create(), [10, 20]));
    expect(ctx2d.savedInstructions).toEqual([['move', [10, 30]]]);
  });
  it('should nest transforms with the branch command correctly', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    drawPath(pathCtx => {
      pathCtx.moveTo([0, 0]);
      pathCtx.branch(pathCtx => {
        pathCtx.pathTo([10, -5]);
      }, mat2d.fromTranslation(mat2d.create(), [10, -20]));
    }, mat2d.fromTranslation(mat2d.create(), [5, 0]));

    expect(ctx2d.savedInstructions).toEqual([['move', [5, 0]], ['line', [25, -25]]]);
  });
  it('should transform points into local space', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    const outPoint = [0, 0];
    drawPath(pathCtx => {
      pathCtx.globalToLocal(outPoint, [10, 0]);
    }, mat2d.fromTranslation(mat2d.create(), [10, -10]));

    expect(outPoint).toEqual([0, 10]);
  });
  it('should transform points into global space', () => {
    const ctx2d = mockContext2d();
    const drawPath = bristle({ ctx2d });
    const outPoint = [0, 0];
    drawPath(pathCtx => {
      pathCtx.localToGlobal(outPoint, [10, 0]);
    }, mat2d.fromTranslation(mat2d.create(), [10, -10]));

    expect(outPoint).toEqual([20, -10]);
  });
  it('should be able to output a string path representation', () => {
    const drawPath = bristle({ outputToString: true });
    const output = drawPath(pathCtx => {
      pathCtx
        .moveTo([10, 0])
        .controlAt([5, 10])
        .controlAt([10, 15])
        .pathTo([15, 20])
        .controlAt([30, 5])
        .pathTo([25, 0])
        .pathTo([15, 0]);
    });
    expect(output).toEqual('M10,0C5,10,10,15,15,20Q30,5,25,0L15,0');
  });
});
