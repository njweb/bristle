import {
  moveInContext,
  lineInContext,
  quadInContext,
  bezierInContext,
  arcInContext
} from "../src/pathInstructions"
import instructionCodes from '../src/instructionCodes'

const buildMockSequencer = () => ({
  instructions: new Array(10).fill(0),
  transform: [10, 20],
  cache: [
    [0, 0],
    [0, 0],
    [0, 0]
  ]
});

describe('path move binding function', () => {
  it('should work', () => {
    const mockSequencer = buildMockSequencer();
    const move = moveInContext(mockSequencer);

    move([4, 6]);

    [
      instructionCodes.move,
      4 + 10,
      6 + 20
    ].forEach((value, index) => {
      expect(mockSequencer.instructions[index + 1]).toBe(value);
    });
  });
});

describe('path line binding function', () => {
  it('should work', () => {
    const mockSequencer = buildMockSequencer();
    const line = lineInContext(mockSequencer);

    line([4, 6]);

    [
      instructionCodes.line,
      4 + 10,
      6 + 20
    ].forEach((value, index) => {
      expect(mockSequencer.instructions[index + 1]).toBe(value);
    });
  });
});

describe('path quadratic binding function', () => {
  it('should work', () => {
    const mockSequencer = buildMockSequencer();
    const quad = quadInContext(mockSequencer);

    quad([2, 4], [6, 7]);

    [
      instructionCodes.quad,
      2 + 10,
      4 + 20,
      6 + 10,
      7 + 20
    ].forEach((value, index) => {
      expect(mockSequencer.instructions[index + 1]).toBe(value);
    });
  })
});


describe('path bezier binding function', () => {
  it('should work', () => {
    const mockSequencer = buildMockSequencer();
    const bezier = bezierInContext(mockSequencer);

    bezier([1, 3], [2, 4], [5, 7]);

    [
      instructionCodes.bezier,
      1 + 10,
      3 + 20,
      2 + 10,
      4 + 20,
      5 + 10,
      7 + 20
    ].forEach((value, index) => {
      expect(mockSequencer.instructions[index + 1]).toBe(value);
    });
  });
});

describe('path arc binding function', () => {
  it('should work', () => {
    const mockSequencer = buildMockSequencer();
    const arc = arcInContext(mockSequencer);

    arc([22, 31], 12, Math.PI * 0.4, Math.PI * 0.8, true);

    [
      instructionCodes.arc,
      22 + 10,
      31 + 20,
      12,
      Math.PI * 0.4,
      Math.PI * 0.8,
      1
    ].forEach((value, index) => {
      expect(mockSequencer.instructions[index + 1]).toBe(value);
    });
  });
});

describe('muliple sequetial path functions', () => {
  it('should work', () => {
    const mockSequencer = buildMockSequencer();
    const move = moveInContext(mockSequencer);
    const line = lineInContext(mockSequencer);
    const bezier = bezierInContext(mockSequencer);

    move([5, 7]);
    line([11, 9]);
    bezier([20, 25], [20, 31], [40, 35]);

    [
      instructionCodes.move,
      5 + 10,
      7 + 20,
      instructionCodes.line,
      11 + 10,
      9 + 20,
      instructionCodes.bezier,
      20 + 10,
      25 + 20,
      20 + 10,
      31 + 20,
      40 + 10,
      35 + 20
    ].forEach((value, index) => {
      expect(mockSequencer.instructions[index + 1]).toBe(value);
    });
  });
});