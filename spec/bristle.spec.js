import bristle from '../src/index.js'
import instructionCodes from '../src/instructionCodes'
import {canvasRenderingContext2DMock} from "./canvasRenderingContext2D.mock";

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
    }, [0, 0], {});

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

    const myCanvasContext = canvasRenderingContext2DMock();

    const nuInstructions = bristle.renderCanvas(
      {
        canvasContext2D: myCanvasContext,
        projection: (out, point) => {
          out[0] = point[0] + 10;
          out[1] = point[1] * -2;
          return out;
        },
        instructions
      });

    console.log('RESULT: ', nuInstructions);
  });
});