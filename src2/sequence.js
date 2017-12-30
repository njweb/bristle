
//------------------Actions

// branch

// move
// line
// arc
// quad
// bezier

//------------------Properties

// state
// instructions
// transformation
// tip

import {seq} from "../src/actions";
import instructions from "../src/instructions";
import {applyTransform} from "./transform";
import {
  bindSequencerToMove,
  bindSequencerToLine,
  bindSequencerToQuad,
  bindSequencerToBezier,
  bindSequencerToArc
} from "./pathInstructions";

export const bindBranchMethodToSequencer = sequencer => (transform, predicate) => {
  const previousTransform = sequencer.transform;
  // TODO => use add transforms here
  sequencer.transform = transform;
  predicate(sequencer);
  sequencer.transform = previousTransform;
  return sequencer;
};

export const sequence = ({instructions, transform, state}) => {
  const pointCacheBuffer = new ArrayBuffer(24);
  const sequencer = {
    instructions,
    transform,
    state,
    cache: [
      new Float32Array(pointCacheBuffer, 0, 2),
      new Float32Array(pointCacheBuffer, 4 * 2, 2),
      new Float32Array(pointCacheBuffer, 4 * 4, 2)
    ],
    tip: [0, 0] // TODO => apply transform to origin point
  };
  sequencer.branch = bindBranchMethodToSequencer(sequencer);
  sequencer.move = bindSequencerToMove(sequencer);
  sequencer.line = bindSequencerToLine(sequencer);
  sequencer.quad = bindSequencerToQuad(sequencer);
  sequencer.bezier = bindSequencerToBezier(sequencer);
  sequencer.arc = bindSequencerToArc(sequencer);
  // TODO => add path manipulation methods here
  return sequencer;
};