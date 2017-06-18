import instructions from './instructions'

const pointCacheBuffer = new ArrayBuffer(24);
const cache = [
  new Float32Array(pointCacheBuffer, 0, 2),
  new Float32Array(pointCacheBuffer, 4 * 2, 2),
  new Float32Array(pointCacheBuffer, 4 * 4, 2)
];

export function move(point) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  this.instructions[0] = instructions.move(this.instructions, this.instructions[0], point);
  return this;
}
export function line(point) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  this.instructions[0] = instructions.line(this.instructions, this.instructions[0], point);
  return this;
}
export function draw(point) {
  if(this.instructions[0] === 1) {
    return this.move(point);
  } else {
    return this.line(point);
  }
}
export function quad(point, control){
  point = this.applyTransform(cache[0], this.currentTransform, point);
  control = this.applyTransform(cache[1], this.currentTransform, control);
  this.instructions[0] = instructions.quad(this.instructions, this.instructions[0], point, control);
  return this;
}
export function bezier(point, controlA, controlB){
  point = this.applyTransform(cache[0], this.currentTransform, point);
  controlA = this.applyTransform(cache[1], this.currentTransform, controlA);
  controlB = this.applyTransform(cache[2], this.currentTransform, controlB);
  this.instructions[0] = instructions.bezier(this.instructions, this.instructions[0], point, controlA, controlB);
  return this;
}
export function arc(point, radius, startAngle, endAngle, isCCW) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  this.instructions[0] = instructions.arc(
    this.instructions,
    this.instructions[0],
    point, radius,
    startAngle,
    endAngle,
    isCCW);
  return this;
}
export function seq(transform, sequencer, state) {
  const storedTransform = [];
  storedTransform[0] = this.currentTransform[0];
  storedTransform[1] = this.currentTransform[1];

  this.currentTransform = this.mergeTransforms(
    this.currentTransform,
    storedTransform,
    transform);

  sequencer(this, state ? state : this.state);

  this.currentTransform[0] = storedTransform[0];
  this.currentTransform[1] = storedTransform[1];

  return this;
}
export function localSeq(sequencer, state) {
  sequencer(this, state ? state : this.state);
  return this;
}

export default {seq, localSeq, move, line, draw, quad, bezier, arc}