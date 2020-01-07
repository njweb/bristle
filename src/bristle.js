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

const mA = createMat2d();
const vA = createVec2();
const vB = createVec2();
const vC = createVec2();

const canvasCommands = {
  moveTo: (ctx2d, p) => ctx2d.moveTo(p[0], p[1]),
  lineTo: (ctx2d, p) => ctx2d.lineTo(p[0], p[1]),
  quadTo: (ctx2d, c, p) => ctx2d.quadraticCurveTo(c[0], c[1], p[0], p[1]),
  bezierTo: (ctx2d, c1, c2, p) => ctx2d.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p[0], p[1]),
}

const bristle = ({ ctx2d, pathState }) => {
  const seqState = {
    branchDepth: 0,
    transformStack: [createMat2d()],

    controlCount: 0,
    controlPoints: [createVec2(), createVec2],
  };

  const getActiveTransform = () => seqState.transformStack[seqState.branchDepth];
  const pushTransform = nextTransform => {
    const t = getActiveTransform();
    const { branchDepth, transformStack } = seqState;
    if (transformStack.length <= branchDepth + 1) {
      transformStack.push(multiplyMat2d(createMat2d(), nextTransform, t));
    } else {
      multiplyMat2d(transformStack[branchDepth + 1], nextTransform, t);
    }
    seqState.branchDepth += 1;
  };
  const popTransform = () => seqState.branchDepth = Math.max(0, seqState.branchDepth - 1);

  const pathActions = [
    // line
    point => {
      canvasCommands.lineTo(ctx2d,
        transformMat2d(vA, point, getActiveTransform()));
    },
    // quad
    point => {
      const t = getActiveTransform();

      canvasCommands.quadTo(ctx2d,
        transformMat2d(vA, seqState.controlPoints[0], t),
        transformMat2d(vB, point, t));

      seqState.controlCount = 0;
    },
    // bezier
    point => {
      const t = getActiveTransform();

      canvasCommands.bezierTo(ctx2d,
        transformMat2d(vA, seqState.controlPoints[0], t),
        transformMat2d(vB, seqState.controlPoints[1], t),
        transformMat2d(vC, point, t));

      seqState.controlCount = 0;
    }
  ];

  let pathContext;
  const methods = {
    moveTo: function(point) {
      canvasCommands.moveTo(ctx2d,
        transformMat2d(vA, point, getActiveTransform()));
      return pathContext;
    },
    pathTo: function(point) {
      pathActions[seqState.controlCount](point);
      return pathContext
    },
    controlAt: function(point) {
      if (seqState.controlCount > 1) throw Error('Attempt to assign too many control points');

      copyVec2(seqState.controlPoints[seqState.controlCount], point);
      seqState.controlCount += 1;
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

  return methods.branch;
};

export default bristle;
