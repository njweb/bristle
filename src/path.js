import {
  moveInContext,
  lineInContext,
  quadInContext,
  bezierInContext,
  arcInContext
} from "./pathInstructions";
import {applyScalarTransform} from "./transform";
import {transformMat2d as applyTransform} from "./glMatrix/vec2";
import { create as mat2dCreate, multiply as mat2dMultiply} from "./glMatrix/mat2d";

const IDENTITY_TRANSFORM = mat2dCreate();

const branchInContext = context => (predicate, transform, state) => {
  const previousState = context.state;
  const previousTransform = context.transform;

  if(transform) {
    context.transform = transform;
  }
  if(state) {
    context.state = state;
  }

  predicate(context);

  context.transform = previousTransform;
  context.state = previousState;

  return context;
};

const actionInContext = context => predicate => {
  predicate(context);
  return context;
};

export const createPath = (instructions) => {
  const cacheBuffer = new ArrayBuffer(24);
  const bristleContext = {
    instructions,
    transform: IDENTITY_TRANSFORM,
    pathTip: [0, 0],
    state: null,
    cache: [
      new Float32Array(cacheBuffer, 0, 2),
      new Float32Array(cacheBuffer, 4 * 2, 2),
      new Float32Array(cacheBuffer, 4 * 4, 2)
    ],
    branch: null,
    action: null,
    move: null,
    line: null,
    quad: null,
    bezier: null,
    arc: null,
    applyTransform,
    applyScalarTransform
  };

  bristleContext.branch = branchInContext(bristleContext);
  bristleContext.action = actionInContext(bristleContext);
  bristleContext.move = moveInContext(bristleContext);
  bristleContext.line = lineInContext(bristleContext);
  bristleContext.quad = quadInContext(bristleContext);
  bristleContext.bezier = bezierInContext(bristleContext);
  bristleContext.arc = arcInContext(bristleContext);

  return (predicate, transform, state) => {
    bristleContext.instructions[0] = 0;

    bristleContext.transform = transform ? transform : IDENTITY_TRANSFORM;
    bristleContext.state = state ? state : null;
    predicate(bristleContext);

    return bristleContext.instructions;
  }
};