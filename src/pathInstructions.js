import instructionCodes from './instructionCodes'
import validatePoint from './validation/validatePoint'

export const moveInContext = context => point => {
  if(ENVIRONMENT === 'development') {
      validatePoint(point);
  }

  const {instructions, transform, cache} = context;
  const transformedPoint = context.applyTransform(cache[0], point, transform);

  const index = instructions[0];
  instructions[index + 1] = instructionCodes.move;
  instructions[index + 2] = transformedPoint[0];
  instructions[index + 3] = transformedPoint[1];
  instructions[0] = index + 3;

  context.pathTip[0] = transformedPoint[0];
  context.pathTip[1] = transformedPoint[1];

  return context;
};

export const lineInContext = context => point => {
  if(ENVIRONMENT === 'development') {
    validatePoint(point);
  }

  const {instructions, transform, cache} = context;
  const transformedPoint = context.applyTransform(cache[0], point, transform);

  let index = instructions[0];
  instructions[index + 1] = instructionCodes.line;
  instructions[index + 2] = transformedPoint[0];
  instructions[index + 3] = transformedPoint[1];
  instructions[0] = index + 3;

  context.pathTip[0] = transformedPoint[0];
  context.pathTip[1] = transformedPoint[1];

  return context;
};

export const quadInContext = context => (control, point) => {
  if(ENVIRONMENT === 'development') {
    validatePoint(control, 'control');
    validatePoint(point);
  }

  const {instructions, transform, cache} = context;
  const transformedControl = context.applyTransform(cache[0], control, transform);
  const transformedPoint = context.applyTransform(cache[1], point, transform);

  let index = instructions[0];
  instructions[index + 1] = instructionCodes.quad;
  instructions[index + 2] = transformedControl[0];
  instructions[index + 3] = transformedControl[1];
  instructions[index + 4] = transformedPoint[0];
  instructions[index + 5] = transformedPoint[1];
  instructions[0] = index + 5;

  context.pathTip[0] = transformedPoint[0];
  context.pathTip[1] = transformedPoint[1];

  return context;
};

export const bezierInContext = context => (controlA, controlB, point) => {
  if(ENVIRONMENT === 'development') {
    validatePoint(controlA, 'controlA');
    validatePoint(controlB, 'controlB');
    validatePoint(point);
  }

  const {instructions, transform, cache} = context;
  const index = instructions[0] + 1;

  const transformedControlA = context.applyTransform(cache[0], controlA, transform);
  const transformedControlB = context.applyTransform(cache[1], controlB, transform);
  const transformedPoint = context.applyTransform(cache[2], point, transform);

  instructions[index] = instructionCodes.bezier;

  instructions[index + 1] = transformedControlA[0];
  instructions[index + 2] = transformedControlA[1];

  instructions[index + 3] = transformedControlB[0];
  instructions[index + 4] = transformedControlB[1];

  instructions[index + 5] = transformedPoint[0];
  instructions[index + 6] = transformedPoint[1];

  instructions[0] = index + 6;

  context.pathTip[0] = transformedPoint[0];
  context.pathTip[1] = transformedPoint[1];

  return context;
};

export const arcInContext = context => (center, radius, startAngle, endAngle, isCCW) => {
  const {instructions, transform, cache} = context;
  const index = instructions[0] + 1;
  const transformedCenter = context.applyTransform(cache[0], center, transform);
  const transformedRadius = context.applyScalarTransform(radius, transform);

  instructions[index] = instructionCodes.arc;

  instructions[index + 1] = transformedCenter[0];
  instructions[index + 2] = transformedCenter[1];
  instructions[index + 3] = transformedRadius;
  instructions[index + 4] = startAngle;
  instructions[index + 5] = endAngle;
  instructions[index + 6] = isCCW ? 1 : 0;

  instructions[0] = index + 6;

  const transformedPoint = context.applyTransform(cache[1],
      [
        center[0] + (Math.cos(endAngle) * transformedRadius),
        center[1] + (Math.sin(endAngle) * transformedRadius)
      ],
      transform
    );

  context.pathTip[0] = transformedPoint[0];
  context.pathTip[1] = transformedPoint[1];

  return context;
};