import instructionCodes from './codes.js';
import {validatePoint, isNumber} from './validate';

export const move = (outInstructions, index, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(point)) throw TypeError(result);
  }

  outInstructions[index] = instructionCodes.move;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
export const line = (outInstructions, index, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(point)) throw TypeError(result);
  }

  outInstructions[index] = instructionCodes.line;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
export const quad = (outInstructions, index, control, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(control)) throw TypeError('control: ' + result);
    if(result = validatePoint(point)) throw TypeError('point: ' + result);
  }

  outInstructions[index] = instructionCodes.quad;
  outInstructions[index + 1] = control[0];
  outInstructions[index + 2] = control[1];
  outInstructions[index + 3] = point[0];
  outInstructions[index + 4] = point[1];
  return index += 5;
};

export const bezier = (outInstructions, index, controlA, controlB, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(controlA)) throw TypeError('controlA: ' + result);
    if(result = validatePoint(controlB)) throw TypeError('controlB: ' + result);
    if(result = validatePoint(point)) throw TypeError('point: ' + result);
  }

  outInstructions[index] = instructionCodes.bezier;
  outInstructions[index + 1] = controlA[0];
  outInstructions[index + 2] = controlA[1];
  outInstructions[index + 3] = controlB[0];
  outInstructions[index + 4] = controlB[1];
  outInstructions[index + 5] = point[0];
  outInstructions[index + 6] = point[1];
  return index + 7;
};

export const arc = (outInstructions, index, point, radius, startAngle, endAngle, isCCW) => {

  if(process.env.NODE_ENV !== 'production') {
    let result;
    if(result = validatePoint(point)) throw TypeError('point: ' + result);
    if(!isNumber(radius)) throw TypeError('radius must be a number');
    if(!isNumber(startAngle)) throw TypeError('start angle must be a number');
    if(!isNumber(endAngle)) throw TypeError('end angle must be a number');
  }

  outInstructions[index] = instructionCodes.arc;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  outInstructions[index + 3] = radius;
  outInstructions[index + 4] = startAngle;
  outInstructions[index + 5] = endAngle;
  outInstructions[index + 6] = isCCW === true ? 1 : 0;
  return index + 7;
};

export default {move, line, quad, bezier, arc}