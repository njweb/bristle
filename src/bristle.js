import {
  create as createMat2d,
  multiply as multiplyMat2d,
  invert as invertMat2d,
} from 'gl-matrix/esm/mat2d';

import {
  create as createVec2,
  copy as copyVec2,
  transformMat2d,
} from 'gl-matrix/esm/vec2';

const ERR_MSG_NO_OUTPUT_TARGET = 'Must provide a canvas 2d context or activate output to string';
const ERR_MSG_TOO_MANY_CONTROL_POINTS = 'Attempt to assign too many control points';

const mA = createMat2d();
const vA = createVec2();
const vB = createVec2();
const vC = createVec2();

const buildCanvasCommands = ctx2d => ({
  moveTo: p => ctx2d.moveTo(p[0], p[1]),
  lineTo: p => ctx2d.lineTo(p[0], p[1]),
  quadTo: (c, p) => ctx2d.quadraticCurveTo(c[0], c[1], p[0], p[1]),
  bezierTo: (c1, c2, p) => ctx2d.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p[0], p[1]),
});

const buildStringCommands = bristleState => ({
  moveTo: p => bristleState.stringPath += `M${p[0]},${p[1]}`,
  lineTo: p => bristleState.stringPath += `L${p[0]},${p[1]}`,
  quadTo: (c, p) => bristleState.stringPath += `Q${c[0]},${c[1]},${p[0]},${p[1]}`,
  bezierTo: (c1, c2, p) => bristleState.stringPath += `C${c1[0]},${c1[1]},${c2[0]},${c2[1]},${p[0]},${p[1]}`,
});

const bristle = ({ ctx2d, pathState, outputToString = false}) => {
  if(!ctx2d && !outputToString) throw Error(ERR_MSG_NO_OUTPUT_TARGET);

  const bristleState = {
    branchDepth: 0,
    transformStack: [createMat2d()],

    controlCount: 0,
    controlPoints: [createVec2(), createVec2],
  };
  if (outputToString) {
    bristleState.pathString = '';
  };
  const commands = outputToString ?
    buildStringCommands(bristleState) :
    buildCanvasCommands(ctx2d);

  const getActiveTransform = () => bristleState.transformStack[bristleState.branchDepth];
  const pushTransform = nextTransform => {
    const t = getActiveTransform();
    const { branchDepth, transformStack } = bristleState;
    if (transformStack.length <= branchDepth + 1) {
      transformStack.push(multiplyMat2d(createMat2d(), nextTransform, t));
    } else {
      multiplyMat2d(transformStack[branchDepth + 1], nextTransform, t);
    }
    bristleState.branchDepth += 1;
  };
  const popTransform = () => bristleState.branchDepth = Math.max(0, bristleState.branchDepth - 1);

  const pathActions = [
    point => {
      // line
      commands.lineTo(transformMat2d(vA, point, getActiveTransform()));
    },
    point => {
      // quad
      const t = getActiveTransform();

      commands.quadTo(
        transformMat2d(vA, bristleState.controlPoints[0], t),
        transformMat2d(vB, point, t));

      bristleState.controlCount = 0;
    },
    point => {
      // bezier
      const t = getActiveTransform();

      commands.bezierTo(
        transformMat2d(vA, bristleState.controlPoints[0], t),
        transformMat2d(vB, bristleState.controlPoints[1], t),
        transformMat2d(vC, point, t));

      bristleState.controlCount = 0;
    }
  ];

  let pathContext;
  const methods = {
    moveTo: function(point) {
      commands.moveTo(transformMat2d(vA, point, getActiveTransform()));
      return pathContext;
    },
    pathTo: function(point) {
      pathActions[bristleState.controlCount](point);
      return pathContext
    },
    controlAt: function(point) {
      if (bristleState.controlCount > 1) throw Error(ERR_MSG_TOO_MANY_CONTROL_POINTS);

      copyVec2(bristleState.controlPoints[bristleState.controlCount], point);
      bristleState.controlCount += 1;
      return pathContext
    },
    localToGlobal: function(out, point) {
      return transformMat2d(out, point, getActiveTransform());
    },
    globalToLocal: function(out, point) {
      invertMat2d(mA, getActiveTransform());
      return transformMat2d(out, point, mA);
    },
    branch: function(sequenceFn, transform) {
      if (transform) {
        pushTransform(transform);
      }
      sequenceFn(pathContext, pathState);
      if (transform) {
        popTransform();
      }
    },
  };

  methods.m = methods.moveTo;
  methods.p = methods.pathTo;
  methods.c = methods.controlAt;
  methods.b = methods.branch;

  pathContext = Object.assign(Object.create(methods), { ctx2d });

  return outputToString ?
    (sequenceFn, transform) => {
      bristleState.pathString = '';
      pathContext.branch(sequenceFn, transform);
      return bristleState.pathString;
    } : pathContext.branch;
};

export default bristle;
