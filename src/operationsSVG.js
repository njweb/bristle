const pointCacheBuffer = new ArrayBuffer(24);
const cache = [
  new Float32Array(pointCacheBuffer, 0, 2),
  new Float32Array(pointCacheBuffer, 4 * 2, 2),
  new Float32Array(pointCacheBuffer, 4 * 4, 2)
];

export const move = function move(projection, pathContainer, instructions, index) {
  const point = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  pathContainer.value += `M${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 3;
};

export const line = function line(projection, pathContainer, instructions, index) {
  const point = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  pathContainer.value += `L${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 3;
};

export const quad = function quad(projection, pathContainer, instructions, index) {
  const control = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  const point = projection(
    cache[1], instructions.slice(index + 3, index + 5));
  pathContainer.value += `Q${control[0]} ${control[1]} ${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 5;
};

export const bezier = function bezier(projection, pathContainer, instructions, index) {
  const controlA = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  const controlB = projection(
    cache[1], instructions.slice(index + 3, index + 5));
  const point = projection(
    cache[2], instructions.slice(index + 5, index + 7));
  pathContainer.value += `C${controlA[0]} ${controlA[1]} ${controlB[0]} ${controlB[1]} ${point[0]} ${point[1]}`;

  pathContainer.pathTip[0] = point[0];
  pathContainer.pathTip[1] = point[1];

  return index + 7;
};

export const _projectArcEdgePoint = function _projectArcEdgePoint(out, radius, angle, center, projection) {
  out[0] = (Math.cos(angle) * radius) + center[0];
  out[1] = (Math.sin(angle) * radius) + center[1];
  return out;
};

export const _isLargeArcSweep = function _isLargeArcSweep(startAngle, endAngle, sweepFlag) {
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

export const _arePointsApproximatelyEqual = function _arePointsApproximatelyEqual(pointA, pointB) {
  const cutoff = 0.01;
  return Math.abs(pointA[0] - pointB[0]) < cutoff && Math.abs(pointA[1] - pointB[1]) < cutoff;
};

export const arc = function arc(projection, pathContainer, instructions, index) {
  const point = projection(cache[0], instructions.slice(index + 1, index + 3));
  const radius = projection(cache[1], [instructions[index + 3], 0])[0];
  const startAngle = instructions[index + 4];
  const endAngle = instructions[index + 5];
  const startPoint = _projectArcEdgePoint(cache[1], radius, startAngle, point, projection);
  const endPoint = _projectArcEdgePoint(cache[1], radius, startAngle, point, projection);
  const sweepFlag = instructions[index + 6] !== 0 ? 0 : 1;
  const isLargeArc = _isLargeArcSweep(startAngle, endAngle, sweepFlag) ? 0 : 1;

  if(!_arePointsApproximatelyEqual(pathContainer.pathTip, startPoint)){
    pathContainer.value += `L${startPoint[0]} ${startPoint[1]}`;
  }

  pathContainer.value += `A${radius} ${radius} 0 ${isLargeArc} ${sweepFlag} ${endPoint[0]} ${endPoint[1]}`;

  pathContainer.pathTip[0] = endPoint[0];
  pathContainer.pathTip[1] = endPoint[1];

  return index + 7;
};

export default {move, line, quad, bezier, arc}