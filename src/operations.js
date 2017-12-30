import codes from './codes'

const pointCacheBuffer = new ArrayBuffer(24);
const cache = [
  new Float32Array(pointCacheBuffer, 0, 2),
  new Float32Array(pointCacheBuffer, 4 * 2, 2),
  new Float32Array(pointCacheBuffer, 4 * 4, 2)
];

export const move = function move(canvasContext2D, instructions, index, projection) {
  const point = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  canvasContext2D.moveTo(point[0], point[1]);
  return index + 3;
};

export const line = function line(canvasContext2D, instructions, index, projection) {
  const point = projection(
    cache[0], instructions.slice(index + 1, index + 3));
  canvasContext2D.lineTo(point[0], point[1]);
  return index + 3;
};

export const quad = function quad(canvasContext2D, instructions, index, projection) {
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

export const bezier = function bezier(canvasContext2D, instructions, index, projection) {
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

export const arc = function arc(canvasContext2D, instructions, index, projection) {
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

export default {move, line, quad, bezier, arc}
