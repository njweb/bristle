import {instructionCodes} from './codes.js';
import {validatePoint} from './validate';

let moveTo = (outInstructions, index, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(point)) throw TypeError(result);
  }

  outInstructions[index] = instructionCodes.moveTo;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
let lineTo = (outInstructions, index, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(point)) throw TypeError(result);
  }

  outInstructions[index] = instructionCodes.lineTo;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
let quadTo = (outInstructions, index, control, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(control)) throw TypeError('control: ' + result);
    if(result = validatePoint(point)) throw TypeError('point: ' + result);
  }

  outInstructions[index] = instructionCodes.quadTo;
  outInstructions[index + 1] = control[0];
  outInstructions[index + 2] = control[1];
  outInstructions[index + 3] = point[0];
  outInstructions[index + 4] = point[1];
  return index += 5;
};

let bezierTo = (outInstructions, index, controlA, controlB, point) => {

  if(process.env.NODE_ENV !== "production"){
    let result;
    if(result = validatePoint(controlA)) throw TypeError('controlA: ' + result);
    if(result = validatePoint(controlB)) throw TypeError('controlB: ' + result);
    if(result = validatePoint(point)) throw TypeError('point: ' + result);
  }

  outInstructions[index] = instructionCodes.bezierTo;
  outInstructions[index + 1] = controlA[0];
  outInstructions[index + 2] = controlA[1];
  outInstructions[index + 3] = controlB[0];
  outInstructions[index + 4] = controlB[1];
  outInstructions[index + 5] = point[0];
  outInstructions[index + 6] = point[1];
  return index + 7;
};

export {moveTo, lineTo, quadTo, bezierTo}

export default {moveTo, lineTo, quadTo, bezierTo}