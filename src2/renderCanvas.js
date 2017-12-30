import instructionCodes from './instructionCodes'

const moveOperation = (canvasContext2D,
                       instructions,
                       index,
                       projection,
                       cache) => {
  const point = projection(cache[0], instructions.slice(index + 1, index + 3));
  canvasContext2D.moveTo(point[0], point[1]);
  return index + 3;
};

const lineOperation = (canvasContext2D,
                       instructions,
                       index,
                       projection,
                       cache) => {
  const point = projection(cache[0], instructions.slice(index + 1, index + 3));
  canvasContext2D.lineTo(point[0], point[1]);
  return index + 3;
};

const quadOperation = (canvasContext2D,
                       instructions,
                       index,
                       projection,
                       cache) => {
  const control = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  const point = projection(
    cache[1], instructions.slice(index + 3, index + 5));
  canvasContext2D.quadraticCurveTo(
    control[0],
    control[1],
    point[0],
    point[1]);
  return index + 5;
};

const bezierOperation = (canvasContext2D,
                         instructions,
                         index,
                         projection,
                         cache) => {
  const controlA = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  const controlB = projection(
    cache[1], instructions.slice(index + 3, index + 5));
  const point = projection(
    cache[2], instructions.slice(index + 5, index + 7));
  canvasContext2D.bezierCurveTo(
    controlA[0],
    controlA[1],
    controlB[0],
    controlB[1],
    point[0],
    point[1]);
  return index + 7;
};

const arcOperation = (canvasContext2D,
                      instructions,
                      index,
                      projection,
                      cache) => {
  const point = projection(cache[0], instructions.slice(index + 1, index + 3));
  const radius = projection(cache[1], [instructions[index + 3], 0])[0];
  const isCCW = instructions[index + 6] !== 0;
  canvasContext2D.arc(
    point[0],
    point[1],
    radius,
    instructions[index + 4],
    instructions[index + 5],
    isCCW
  );
  return index + 7;
};

const renderOperations = [];
renderOperations[instructionCodes.move] = moveOperation;
renderOperations[instructionCodes.line] = lineOperation;
renderOperations[instructionCodes.quad] = quadOperation;
renderOperations[instructionCodes.bezier] = bezierOperation;
renderOperations[instructionCodes.arc] = arcOperation;

const renderToCanvas = (canvasContext2D, projection, cache) => instructions => {
  const limitIndex = instructions[0];
  let index = 1;
  while (index < limitIndex) {
    index = renderOperations[instructions[index]](
      canvasContext2D,
      instructions,
      index,
      projection,
      cache
    );
  }
  return instructions;
};

export const renderCanvas = ({canvasContext2D, projection, instructions}) => {
  const pointCacheBuffer = new ArrayBuffer(24);
  const cache = [
    new Float32Array(pointCacheBuffer, 0, 2),
    new Float32Array(pointCacheBuffer, 4 * 2, 2),
    new Float32Array(pointCacheBuffer, 4 * 4, 2)
  ];

  const renderer = renderToCanvas(canvasContext2D, projection);
  if (instructions) {
    return renderToCanvas(instructions);
  }
  else return renderer;
};