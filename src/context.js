import actions from './actions'
import transforms from './transforms'

const baseContext = {
  seq: actions.seq,
  localSeq: actions.localSeq,
  move: actions.move,
  line: actions.line,
  draw: actions.draw,
  quad: actions.quad,
  bezier: actions.bezier,
  applyTransform: transforms.apply,
  mergeTransforms: transforms.merge,
  applyCurrentTransform: transforms.applyCurrent
};

export default (configuration) => {

  configuration = configuration || { instructions: [] };

  if (process.env.NODE_ENV !== "production") {
    if (!Array.isArray(configuration.instructions)) {
      throw new Error('Must provide an instructions array when creating a new context');
    }
    if(configuration.currentTransform && configuration.currentTransform.length < 2) {
      throw new Error('Current transform array must have at least length of 2');
    }
  }

  configuration.instructions[0] = 1;

  return Object.assign({}, baseContext, {
    instructions: configuration.instructions,
    currentTransform: configuration.transform || [0, 0]
  });
};