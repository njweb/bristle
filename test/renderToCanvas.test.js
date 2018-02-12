import bristle from "../src/bristle";
import instructionCodes from "../src/instructionCodes";

let mockCanvasRenderingContext2d = () => {
  return {
    canvas: {width: 100, height: 50},

    _storage: [],
    get storage() {
      return this._storage;
    },
    reset: function () {
      this._storage = [];
    },

    moveTo: function (x, y) {
      this.storage.push({type: 'moveTo', point: [x, y]});
    },
    lineTo: function (x, y) {
      this.storage.push({type: 'lineTo', point: [x, y]});
    },
    bezierCurveTo: function (xCA, yCA, xCB, yCB, x, y) {
      this.storage.push({type: 'bezierCurveTo', controlA: [xCA, yCA], controlB: [xCB, yCB], point: [x, y]});
    },
    quadraticCurveTo: function (xC, yC, x, y) {
      this.storage.push({type: 'quadraticCurveTo', control: [xC, yC], point: [x, y]});
    },
    arc: function (x, y, radius, startAngle, endAngle, isCCW) {
      this._storage.push({type: 'arc', point: [x, y], radius, startAngle, endAngle, isCCW});
    }
  };
};

describe('bristle render', () => {
  it('should sorta work', () => {
    const instructions = [].concat(
      18,
      instructionCodes.move,
      [2, 4],
      instructionCodes.line,
      [4, -10],
      instructionCodes.quad,
      [10, -10],
      [14, 0],
      instructionCodes.bezier,
      [14, -10],
      [10, -8],
      [2, -2]
    );

    const mockCanvasContext = mockCanvasRenderingContext2d();

    bristle.renderToCanvas(
      {
        canvasContext2d: mockCanvasContext,
        instructions
      });

    expect(JSON.stringify(mockCanvasContext.storage)).toMatchSnapshot();
  });
});