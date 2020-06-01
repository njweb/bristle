import { create, invert, multiply } from 'gl-matrix/esm/mat2d';
import { create as create$1, transformMat2d, copy } from 'gl-matrix/esm/vec2';

var ERR_MSG_NO_OUTPUT_TARGET = 'Must provide a canvas 2d context or activate output to string';
var ERR_MSG_TOO_MANY_CONTROL_POINTS = 'Attempt to assign too many control points';
var mA = create();
var vA = create$1();
var vB = create$1();
var vC = create$1();

var buildCanvasCommands = function buildCanvasCommands(ctx2d) {
  return {
    moveTo: function moveTo(p) {
      return ctx2d.moveTo(p[0], p[1]);
    },
    lineTo: function lineTo(p) {
      return ctx2d.lineTo(p[0], p[1]);
    },
    quadTo: function quadTo(c, p) {
      return ctx2d.quadraticCurveTo(c[0], c[1], p[0], p[1]);
    },
    bezierTo: function bezierTo(c1, c2, p) {
      return ctx2d.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p[0], p[1]);
    }
  };
};

var buildStringCommands = function buildStringCommands(bristleState) {
  return {
    moveTo: function moveTo(p) {
      return bristleState.pathString += "M".concat(p[0], " ").concat(p[1]);
    },
    lineTo: function lineTo(p) {
      return bristleState.pathString += "L".concat(p[0], " ").concat(p[1]);
    },
    quadTo: function quadTo(c, p) {
      return bristleState.pathString += "Q".concat(c[0], " ").concat(c[1], " ").concat(p[0], " ").concat(p[1]);
    },
    bezierTo: function bezierTo(c1, c2, p) {
      return bristleState.pathString += "C".concat(c1[0], " ").concat(c1[1], " ").concat(c2[0], " ").concat(c2[1], " ").concat(p[0], " ").concat(p[1]);
    }
  };
};

var bristle = function bristle(_ref) {
  var ctx2d = _ref.ctx2d,
      pathState = _ref.pathState,
      _ref$outputToString = _ref.outputToString,
      outputToString = _ref$outputToString === void 0 ? false : _ref$outputToString;
  if (!ctx2d && !outputToString) throw Error(ERR_MSG_NO_OUTPUT_TARGET);
  var bristleState = {
    branchDepth: 0,
    transformStack: [create()],
    controlCount: 0,
    controlPoints: [create$1(), create$1]
  };

  if (outputToString) {
    bristleState.pathString = '';
  }
  var commands = outputToString ? buildStringCommands(bristleState) : buildCanvasCommands(ctx2d);

  var getActiveTransform = function getActiveTransform() {
    return bristleState.transformStack[bristleState.branchDepth];
  };

  var pushTransform = function pushTransform(nextTransform) {
    var t = getActiveTransform();
    var branchDepth = bristleState.branchDepth,
        transformStack = bristleState.transformStack;

    if (transformStack.length <= branchDepth + 1) {
      // if there is not enough existing space on the transform stack, push a new matrix
      transformStack.push(multiply(create(), nextTransform, t));
    } else {
      // use an existing matrix on the transform stack
      multiply(transformStack[branchDepth + 1], nextTransform, t);
    }

    bristleState.branchDepth += 1;
  };

  var popTransform = function popTransform() {
    return bristleState.branchDepth = Math.max(0, bristleState.branchDepth - 1);
  };

  var pathActions = [function (point) {
    // line
    commands.lineTo(transformMat2d(vA, point, getActiveTransform()));
  }, function (point) {
    // quad
    var t = getActiveTransform();
    commands.quadTo(transformMat2d(vA, bristleState.controlPoints[0], t), transformMat2d(vB, point, t));
    bristleState.controlCount = 0;
  }, function (point) {
    // bezier
    var t = getActiveTransform();
    commands.bezierTo(transformMat2d(vA, bristleState.controlPoints[0], t), transformMat2d(vB, bristleState.controlPoints[1], t), transformMat2d(vC, point, t));
    bristleState.controlCount = 0;
  }];
  var pathContext;
  var methods = {
    moveTo: function moveTo(point) {
      commands.moveTo(transformMat2d(vA, point, getActiveTransform()));
      return pathContext;
    },
    pathTo: function pathTo(point) {
      pathActions[bristleState.controlCount](point);
      return pathContext;
    },
    setControl: function setControl(point) {
      if (bristleState.controlCount > 1) throw Error(ERR_MSG_TOO_MANY_CONTROL_POINTS);
      copy(bristleState.controlPoints[bristleState.controlCount], point);
      bristleState.controlCount += 1;
      return pathContext;
    },
    localToGlobal: function localToGlobal(out, point) {
      return transformMat2d(out, point, getActiveTransform());
    },
    globalToLocal: function globalToLocal(out, point) {
      invert(mA, getActiveTransform());
      return transformMat2d(out, point, mA);
    },
    branch: function branch(sequenceFn, transform) {
      if (transform) {
        pushTransform(transform);
      }

      sequenceFn(pathContext, pathState);

      if (transform) {
        popTransform();
      }
    }
  }; // setup aliases

  methods.m = methods.moveTo;
  methods.p = methods.pathTo;
  methods.c = methods.setControl;
  methods.b = methods.branch;
  pathContext = Object.assign(Object.create(methods), {
    ctx2d: ctx2d
  });
  return outputToString ? function (sequenceFn, transform) {
    bristleState.pathString = '';
    pathContext.branch(sequenceFn, transform);
    return bristleState.pathString;
  } : pathContext.branch;
};

export default bristle;
