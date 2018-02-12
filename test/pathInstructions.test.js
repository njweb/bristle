import {
  moveInContext,
  lineInContext,
  quadInContext,
  bezierInContext,
  arcInContext
} from "../src/pathInstructions"
import {applyScalarTransform} from '../src/transform'
import instructionCodes from '../src/instructionCodes'
import * as mat2d from '../src/glMatrix/mat2d'
import {transformMat2d as applyTransform} from "../src/glMatrix/vec2";

const transform = mat2d.fromTranslation(mat2d.create(), [10, 20]);

const buildMockSequencer = () => ({
  instructions: [0],
  transform,
  cache: [
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  pathTip: [0, 0],
  applyTransform,
  applyScalarTransform
});

let mockSequencer;

describe('Bristle path instructions', () => {
  describe('move function', () => {
    beforeEach(() => {
      mockSequencer = buildMockSequencer();
      const move = moveInContext(mockSequencer);
      move([4, 6])
    });

    it('should produce the expected instructions', () => {
      expect(mockSequencer.instructions).toEqual([
        3,
        instructionCodes.move,
        4 + 10,
        6 + 20
      ]);
    });

    it('should update the tipPoint correctly', () => {
      expect(mockSequencer.pathTip).toEqual([14, 26]);
    });
  });

  describe('line function', () => {
    beforeEach(() => {
      mockSequencer = buildMockSequencer();
      const line = lineInContext(mockSequencer);
      line([4, 6]);
    });
    it('should produce the expected instructions', () => {
      expect(mockSequencer.instructions).toEqual([
        3,
        instructionCodes.line,
        4 + 10,
        6 + 20
      ]);
    });

    it('should update the tipPoint correctly', () => {
      expect(mockSequencer.pathTip).toEqual([10 + 4, 20 + 6]);
    });
  });

  describe('path quadratic binding function', () => {
    beforeEach(() => {
      mockSequencer = buildMockSequencer();
      const quad = quadInContext(mockSequencer);
      quad([2, 4], [6, 7]);
    });

    it('should produce the expected instructions', () => {
      expect(mockSequencer.instructions).toEqual([
        5,
        instructionCodes.quad,
        2 + 10,
        4 + 20,
        6 + 10,
        7 + 20
      ]);
    });

    it('should update the tipPoint correctly', () => {
      expect(mockSequencer.pathTip).toEqual([6 + 10, 7 + 20]);
    });
  });


  describe('path bezier binding function', () => {
    beforeEach(() => {
      mockSequencer = buildMockSequencer();
      const bezier = bezierInContext(mockSequencer);
      bezier([1, 3], [2, 4], [5, 7]);
    });

    it('should produce the expected instructions', () => {
      expect(mockSequencer.instructions).toEqual([
        7,
        instructionCodes.bezier,
        1 + 10,
        3 + 20,
        2 + 10,
        4 + 20,
        5 + 10,
        7 + 20
      ])
    });

    it('should update the tipPoint correctly', () => {
      expect(mockSequencer.pathTip).toEqual([5 + 10, 7 + 20]);
    });
  });
});
