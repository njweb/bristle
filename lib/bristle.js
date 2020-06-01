/**
 * Common utilities
 * @module glMatrix
 */
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b, c,
 *  d, tx, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0,
 *  c, d, 0,
 *  tx, ty, 1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */

function create() {
  var out = new ARRAY_TYPE(6);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[4] = 0;
    out[5] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */

function invert(out, a) {
  var aa = a[0],
      ab = a[1],
      ac = a[2],
      ad = a[3];
  var atx = a[4],
      aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}
/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */

function multiply(out, a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$1() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

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
      return bristleState.pathString += "M".concat(p[0], ",").concat(p[1]);
    },
    lineTo: function lineTo(p) {
      return bristleState.pathString += "L".concat(p[0], ",").concat(p[1]);
    },
    quadTo: function quadTo(c, p) {
      return bristleState.pathString += "Q".concat(c[0], ",").concat(c[1], ",").concat(p[0], ",").concat(p[1]);
    },
    bezierTo: function bezierTo(c1, c2, p) {
      return bristleState.pathString += "C".concat(c1[0], ",").concat(c1[1], ",").concat(c2[0], ",").concat(c2[1], ",").concat(p[0], ",").concat(p[1]);
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
      transformStack.push(multiply(create(), nextTransform, t));
    } else {
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
    controlAt: function controlAt(point) {
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
  };
  methods.m = methods.moveTo;
  methods.p = methods.pathTo;
  methods.c = methods.controlAt;
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
