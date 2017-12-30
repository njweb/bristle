import instructionCodes from './instructionCodes'
import {applyTransform, applyScalarTransform} from "./transform";
import {sequence} from "./sequence";

export const bindSequencerToMove = sequencer => point => {
  const {instructions, transform, cache} = sequencer;
  const index = instructions[0]  + 1;
  const transformedPoint = applyTransform(cache[0], transform, point);

  instructions[index] = instructionCodes.move;

  instructions[index + 1] = transformedPoint[0];
  instructions[index + 2] = transformedPoint[1];

  instructions[0] = index + 2;

  return sequencer;
};

export const bindSequencerToLine = sequencer => point => {
  const {instructions, transform, cache} = sequencer;
  const index = instructions[0] + 1;
  const transformedPoint = applyTransform(cache[0], transform, point);

  instructions[index] = instructionCodes.line;

  instructions[index + 1] = transformedPoint[0];
  instructions[index + 2] = transformedPoint[1];

  instructions[0] = index + 2;

  return sequencer;
};

export const bindSequencerToQuad = sequencer => (control, point) => {
  const {instructions, transform, cache} = sequencer;
  const index = instructions[0] + 1;

  const transformedControl = applyTransform(cache[0], transform, control);
  const transformedPoint = applyTransform(cache[1], transform, point);

  instructions[index] = instructionCodes.quad;

  instructions[index + 1] = transformedControl[0];
  instructions[index + 2] = transformedControl[1];

  instructions[index + 3] = transformedPoint[0];
  instructions[index + 4] = transformedPoint[1];

  instructions[0] = index + 4;

  return sequencer;
};

export const bindSequencerToBezier = sequencer => (controlA, controlB, point) => {
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

export const bindSequencerToArc = sequencer => (center, radius, startAngle, endAngle, isCCW) => {
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