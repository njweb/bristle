import {
  moveInContext,
  lineInContext,
  quadInContext,
  bezierInContext,
  arcInContext
} from "./pathInstructions";

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

const path = (instructions) => {
  const cacheBuffer = new ArrayBuffer(24);
  const bristleContext = {
    instructions,
    transform: [0, 0],
    state: null,
    cache: [
      new Float32Array(cacheBuffer, 0, 2),
      new Float32Array(cacheBuffer, 4 * 2, 2),
      new Float32Array(cacheBuffer, 4 * 4, 2)
    ],
    branch: null,
    move: null,
    line: null,
    quad: null,
    bezier: null,
    arc: null
  };

  bristleContext.branch = branchInContext(bristleContext);
  bristleContext.move = moveInContext(bristleContext);
  bristleContext.line = lineInContext(bristleContext);
  bristleContext.quad = quadInContext(bristleContext);
  bristleContext.bezier = bezierInContext(bristleContext);
  bristleContext.arc = arcInContext(bristleContext);

  return (predicate, transform, state) => {
    bristleContext.instructions[0] = 0;
    if(transform) bristleContext.transform = transform;
    if(state) bristleContext.state = state;

    predicate(bristleContext);

    return bristleContext.instructions;
  }
};

export default path;