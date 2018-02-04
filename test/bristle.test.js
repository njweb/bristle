import bristle from '../src/bristle.js'
import instructionCodes from '../src/instructionCodes'
import * as mat2d from "../src/glMatrix/mat2d"
import * as vec2 from '../src/glMatrix/vec2'
import mockCanvasRenderingContext2d from "./_mockCanvasRenderingContext2D"

const movePoint = [0, 0];
const linePoint = [3, 2];
const quadControlPoint = [5, 5];
const quadPoint = [6, 2];

describe('bristle', () => {
  it('should sorta work', () => {
    const instructions = bristle.path([])(ctx => {
      ctx.move(movePoint)
        .line(linePoint)
        .quad(quadControlPoint, quadPoint);
    }, mat2d.create(), {});

    expect(instructions).toEqual([].concat(
      11,
      instructionCodes.move,
      movePoint,
      instructionCodes.line,
      linePoint,
      instructionCodes.quad,
      quadControlPoint,
      quadPoint
    ));

  });
});

describe('bristle render', () => {
  it('should sorta work', () => {
    const instructions = [].concat(
      11,
      instructionCodes.move,
      movePoint,
      instructionCodes.line,
      linePoint,
      instructionCodes.quad,
      quadControlPoint,
      quadPoint
    );

    const mockCanvasContext = mockCanvasRenderingContext2d();

    bristle.renderToCanvas(
      {
        canvasContext2d: mockCanvasContext,
        projection: (out, point) => {
          out[0] = point[0] + 10;
          out[1] = point[1] * -2;
          return out;
        },
        instructions
      });

    console.log('RESULT: ', mockCanvasContext.storage);
  });
});

describe('bristle path branch', () => {
  it('should sorta work', () => {
    const originLinePredicate = (ctx) => {
      ctx.line([0, 0]);
    };
    const pathPredicate = (ctx) => {
      ctx.move([10, 10])
        .line([15, 10])
        .branch(
          originLinePredicate,
          mat2d.multiply(
            mat2d.create(),
            mat2d.fromTranslation(mat2d.create(), ctx.pathTip),
            mat2d.fromTranslation(mat2d.create(), [0, 10])
          )
        ).line([20, 10])
        .line([20, 0]);
    };
    const instructions = bristle
      .path([])(pathPredicate);

    expect(instructions.filter(value => value === 1).length).toBe(4);
    expect(instructions.filter(value => value === 20).length).toBe(3);
  });
});