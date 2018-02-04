import instructionCodes from "./instructionCodes";

export const moveOperation = (pathContainer, instructions, index, cache) => {
  const point = instructions.slice(index + 1, index + 3);
  pathContainer.path += `M ${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 3;
};

export const lineOperation = (pathContainer, instructions, index, cache) => {
  const point = instructions.slice(index + 1, index + 3);
  pathContainer.path += `L ${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 3;
};

export const quadOperation = (pathContainer, instructions, index, cache) => {
  const control = instructions.slice(index + 1, index + 3);
  const point = instructions.slice(index + 3, index + 5)
  pathContainer.path += `Q ${control[0]} ${control[1]} ${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 5;
};

export const bezierOperation = (pathContainer, instructions, index, cache) => {
  const controlA = instructions.slice(index + 1, index + 3);
  const controlB = instructions.slice(index + 3, index + 5);
  const point = instructions.slice(index + 5, index + 7);
  pathContainer.path += `C ${controlA[0]} ${controlA[1]} ${controlB[0]} ${controlB[1]} ${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 7;
};

export const _projectArcEdgePoint = (out, radius, angle, center) => {
  out[0] = (Math.cos(angle) * radius) + center[0];
  out[1] = (Math.sin(angle) * radius) + center[1];
  return out;
};

export const _isLargeArcSweep = (startAngle, endAngle, sweepFlag) => {
  const twoPI = Math.PI * 2;
  startAngle = startAngle % twoPI;
  endAngle = endAngle % twoPI;
  //sweep flag equals 0 means arc is traveling CCW
  let arcTravel = endAngle - startAngle;
  if(sweepFlag === 0 && endAngle < startAngle) {
    endAngle += twoPI;
  } else if (sweepFlag !== 0 && endAngle > startAngle) {
    endAngle = -twoPI + endAngle;
  }
  return Math.abs(startAngle - endAngle) > Math.PI;
};

export const _arePointsApproximatelyEqual = (pointA, pointB) => {
  const cutoff = 0.01;
  return Math.abs(pointA[0] - pointB[0]) < cutoff && Math.abs(pointA[1] - pointB[1]) < cutoff;
};

export const arcOperation = (pathContainer, instructions, index, cache) => {
  const point = instructions.slice(index + 1, index + 3);
  const radius = instructions[index + 3];
  const startAngle = instructions[index + 4];
  const endAngle = instructions[index + 5];
  const startPoint = _projectArcEdgePoint(cache[1], radius, startAngle, point);
  const endPoint = _projectArcEdgePoint(cache[1], radius, startAngle, point);
  const sweepFlag = instructions[index + 6] !== 0 ? 0 : 1;
  const isLargeArc = _isLargeArcSweep(startAngle, endAngle, sweepFlag) ? 0 : 1;

  if(!_arePointsApproximatelyEqual(pathContainer.pathTip, startPoint)){
    pathContainer.path += `L ${startPoint[0]} ${startPoint[1]}`;
  }

  pathContainer.path += `A ${radius} ${radius} 0 ${isLargeArc} ${sweepFlag} ${endPoint[0]} ${endPoint[1]}`;

  pathContainer.pathTip[0] = endPoint[0];
  pathContainer.pathTip[1] = endPoint[1];

  return index + 7;
};

const renderOperations = [];
renderOperations[instructionCodes.move] = moveOperation;
renderOperations[instructionCodes.line] = lineOperation;
renderOperations[instructionCodes.quad] = quadOperation;
renderOperations[instructionCodes.bezier] = bezierOperation;
renderOperations[instructionCodes.arc] = arcOperation;

const performRender = cache => instructions => {
  const pathContainer = {path: ''};
  const endIndex = instructions[0];
  let index = 1;
  while(index < endIndex) {
    index = renderOperations[instructions[index]](
      pathContainer,
      instructions,
      index,
      cache
    );
  }
  return pathContainer.path;
};

export const renderToSvg = ({ instructions }) => {
  const pointCacheBuffer = new ArrayBuffer(24);
  const cache = [
    new Float32Array(pointCacheBuffer, 0, 2),
    new Float32Array(pointCacheBuffer, 4 * 2, 2),
    new Float32Array(pointCacheBuffer, 4 * 4, 2)
  ];

  const renderer = performRender(cache);
  if(instructions) {
    return renderer(instructions);
  }
  else return renderer;
};