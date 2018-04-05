import instructionCodes from './instructionCodes'

const moveOperation = (canvasContext2D, instructions, index, cache) => {
  const point = instructions.slice(index + 1, index + 3);
  canvasContext2D.moveTo(point[0], point[1]);
  return index + 3;
};

const lineOperation = (canvasContext2D, instructions, index, cache) => {
  const point = instructions.slice(index + 1, index + 3);
  canvasContext2D.lineTo(point[0], point[1]);
  return index + 3;
};

const quadOperation = (canvasContext2D, instructions, index, cache) => {
  const control = instructions.slice(index + 1, index + 3);
  const point = instructions.slice(index + 3, index + 5);
  canvasContext2D.quadraticCurveTo(
    control[0],
    control[1],
    point[0],
    point[1]);
  return index + 5;
};

const bezierOperation = (canvasContext2D, instructions, index, cache) => {
  const controlA = instructions.slice(index + 1, index + 3);
  const controlB = instructions.slice(index + 3, index + 5);
  const point = instructions.slice(index + 5, index + 7);
  canvasContext2D.bezierCurveTo(
    controlA[0],
    controlA[1],
    controlB[0],
    controlB[1],
    point[0],
    point[1]);
  return index + 7;
};

const renderOperations = [];
renderOperations[instructionCodes.move] = moveOperation;
renderOperations[instructionCodes.line] = lineOperation;
renderOperations[instructionCodes.quad] = quadOperation;
renderOperations[instructionCodes.bezier] = bezierOperation;

const performRender = (canvasContext2D, cache) => instructions => {
  const endIndex = instructions[0];
  let index = 1;
  while (index < endIndex) {
    index = renderOperations[instructions[index]](
      canvasContext2D,
      instructions,
      index,
      cache
    );
  }
  return instructions;
};

export const renderToCanvas = ({canvasContext2d, instructions}) => {
  const pointCacheBuffer = new ArrayBuffer(24);
  const cache = [
    new Float32Array(pointCacheBuffer, 0, 2),
    new Float32Array(pointCacheBuffer, 4 * 2, 2),
    new Float32Array(pointCacheBuffer, 4 * 4, 2)
  ];

  const renderer = performRender(canvasContext2d, cache);
  if (instructions) {
    renderer(instructions);
    return renderer;
  }
  else return renderer;
};