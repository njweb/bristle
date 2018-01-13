import instructionCodes from './instructionCodes'
import {applyTransform, applyScalarTransform} from "./transform";

export const moveInContext = sequencer => point => {
  const {instructions, transform, cache} = sequencer;
  const transformedPoint = applyTransform(cache[0], transform, point);

  const index = instructions[0];
  instructions[index + 1] = instructionCodes.move;
  instructions[index + 2] = transformedPoint[0];
  instructions[index + 3] = transformedPoint[1];
  instructions[0] = index + 3;

  return sequencer;
};

export const lineInContext = sequencer => point => {
  const {instructions, transform, cache} = sequencer;
  const transformedPoint = applyTransform(cache[0], transform, point);

  let index = instructions[0];
  instructions[index + 1] = instructionCodes.line;
  instructions[index + 2] = transformedPoint[0];
  instructions[index + 3] = transformedPoint[1];
  instructions[0] = index + 3;

  return sequencer;
};

export const quadInContext = sequencer => (control, point) => {
  const {instructions, transform, cache} = sequencer;
  const transformedControl = applyTransform(cache[0], transform, control);
  const transformedPoint = applyTransform(cache[1], transform, point);

  let index = instructions[0];
  instructions[index + 1] = instructionCodes.quad;
  instructions[index + 2] = transformedControl[0];
  instructions[index + 3] = transformedControl[1];
  instructions[index + 4] = transformedPoint[0];
  instructions[index + 5] = transformedPoint[1];
  instructions[0] = index + 5;

  return sequencer;
};

export const bezierInContext = sequencer => (controlA, controlB, point) => {
  const {instructions, transform, cache} = sequencer;
  const index = instructions[0] + 1;

  const transformedControlA = applyTransform(cache[0], controlA, transform);
  const transformedControlB = applyTransform(cache[1], controlB, transform);
  const transformedPoint = applyTransform(cache[2], point, transform);

  instructions[index] = instructionCodes.bezier;

  instructions[index + 1] = transformedControlA[0];
  instructions[index + 2] = transformedControlA[1];

  instructions[index + 3] = transformedControlB[0];
  instructions[index + 4] = transformedControlB[1];

  instructions[index + 5] = transformedPoint[0];
  instructions[index + 6] = transformedPoint[1];

  instructions[0] = index + 6;

  return sequencer;
};

export const arcInContext = sequencer => (center, radius, startAngle, endAngle, isCCW) => {
  const {instructions, transform, cache} = sequencer;
  const index = instructions[0] + 1;
  const transformedCenter = applyTransform(cache[0], center, transform);

  instructions[index] = instructionCodes.arc;

  instructions[index + 1] = transformedCenter[0];
  instructions[index + 2] = transformedCenter[1];
  instructions[index + 3] = applyScalarTransform(radius, transform);
  instructions[index + 4] = startAngle;
  instructions[index + 5] = endAngle;
  instructions[index + 6] = isCCW ? 1 : 0;

  instructions[0] = index + 6;

  return sequencer;
};