(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.bristle = global.bristle || {})));
}(this, (function (exports) { 'use strict';

var instructionCodes = {
  nil: -1,
  moveTo: 0,
  lineTo: 1,
  bezierTo: 2,
  quadTo: 3
};

var moveTo$1 = function moveTo$1(outInstructions, index) {
  var point = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];

  outInstructions[index] = instructionCodes.moveTo;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
var lineTo$1 = function lineTo$1(outInstructions, index) {
  var point = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];

  outInstructions[index] = instructionCodes.lineTo;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
var quadTo$1 = function quadTo$1(outInstructions, index, control, point) {
  outInstructions[index] = instructionCodes.quadTo;
  outInstructions[index + 1] = control[0];
  outInstructions[index + 2] = control[1];
  outInstructions[index + 3] = point[0];
  outInstructions[index + 4] = point[1];
  return index += 5;
};

var bezierTo$1 = function bezierTo$1(outInstructions, index, controlA, controlB, point) {
  outInstructions[index] = instructionCodes.bezierTo;
  outInstructions[index + 1] = controlA[0];
  outInstructions[index + 2] = controlA[1];
  outInstructions[index + 3] = controlB[0];
  outInstructions[index + 4] = controlB[1];
  outInstructions[index + 5] = point[0];
  outInstructions[index + 6] = point[1];
  return index + 7;
};

var push = function push(outTransformArray, index, offset) {
  outTransformArray[index] = offset[0];
  outTransformArray[index + 1] = offset[1];
  return index + 2;
};

var pop = function pop(index) {
  var lowerBound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return Math.max(index - 2, Math.max(lowerBound, 0));
};

var merge = function merge(out, transformA, transformB) {
  out[0] = transformA[0] + transformB[0];
  out[1] = transformA[1] + transformB[1];
  return out;
};

var apply = function apply(out, transform, point) {
  return merge(out, transform, point);
};

var instructions = function instructions(canvasContext, remapCoordinates) {
  var cache = [[0, 0], [0, 0], [0, 0]];
  return {
    moveTo: function moveTo(instructions, index) {
      var point = remapCoordinates(cache[0], instructions.slice(index + 1, index + 3));
      canvasContext.moveTo(point[0], point[1]);
      return index + 3;
    },
    lineTo: function lineTo(instructions, index) {
      var point = remapCoordinates(cache[0], instructions.slice(index + 1, index + 3));
      canvasContext.lineTo(point[0], point[1]);
      return index + 3;
    },
    quadTo: function quadTo(instructions, index) {
      var control = remapCoordinates(cache[0], instructions.slice(index + 1, index + 3));
      var point = remapCoordinates(cache[1], instructions.slice(index + 3, index + 5));
      canvasContext.quadraticCurveTo(control[0], control[1], point[0], point[1]);
      return index + 5;
    },
    bezierTo: function bezierTo(instructions, index) {
      var controlA = remapCoordinates(cache[0], instructions.slice(index + 1, index + 3));
      var controlB = remapCoordinates(cache[1], instructions.slice(index + 3, index + 5));
      var point = remapCoordinates(cache[2], instructions.slice(index + 5, index + 7));
      canvasContext.bezierCurveTo(controlA[0], controlA[1], controlB[0], controlB[1], point[0], point[1]);
      return index + 7;
    }
  };
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var applySequenceConfiguration = function applySequenceConfiguration(obj, configuration) {
  configuration = configuration || {};

  obj.instructions = configuration.instructions || [];
  obj.iIndex = Number.isInteger(configuration.instructionIndex) ? configuration.instructionIndex : 0;
  obj.transforms = configuration.transforms || [];
  obj.tIndex = Number.isInteger(configuration.transformIndex) ? configuration.transformIndex : 0;
  obj.tLowerBound = Number.isInteger(configuration.transformLowerBound) ? configuration.transformLowerBound : 0;
  obj.instructor = configuration.instructor;

  return obj;
};

var capInstructions = function capInstructions(instructions$$1, iIndex) {
  if (iIndex < instructions$$1.length) instructions$$1[iIndex] = -1;
  return instructions$$1;
};

var sequenceActions = {
  cache: [[0, 0], [0, 0], [0, 0]],
  moveTo: function moveTo(p) {
    this.iIndex = moveTo$1(this.instructions, this.iIndex, this.applyTransform(this.cache[0], this.getTransform(this.cache[0]), p));
    return this;
  },
  lineTo: function lineTo(p) {
    this.iIndex = lineTo$1(this.instructions, this.iIndex, this.applyTransform(this.cache[0], this.getTransform(this.cache[0]), p));
    return this;
  },
  quadTo: function quadTo(c, p) {
    this.iIndex = quadTo$1(this.instructions, this.iIndex, this.applyTransform(this.cache[0], this.getTransform(this.cache[0]), c), this.applyTransform(this.cache[1], this.getTransform(this.cache[1]), p));
    return this;
  },
  bezierTo: function bezierTo(cA, cB, p) {
    this.iIndex = bezierTo$1(this.instructions, this.iIndex, this.applyTransform(this.cache[0], this.getTransform(this.cache[0]), cA), this.applyTransform(this.cache[1], this.getTransform(this.cache[1]), cB), this.applyTransform(this.cache[2], this.getTransform(this.cache[2]), p));
    return this;
  },
  getInstructions: function getInstructions() {
    return this.instructions;
  },
  getTransform: function getTransform(out) {
    if (this.tIndex === 0) {
      out[0] = 0;
      out[1] = 0;
    } else {
      out[0] = this.transforms[this.tIndex - 2];
      out[1] = this.transforms[this.tIndex - 1];
    }
    return out;
  },
  applyTransform: function applyTransform(out, t, p) {
    if (this.tIndex === 0) {
      out[0] = p[0];
      out[1] = p[1];
    } else {
      apply(out, t, p);
    }
    return out;
  },
  pushTransform: function pushTransform(t) {
    this.tIndex = push(this.transforms, this.tIndex, merge(this.cache[0], this.getTransform(this.cache[0]), t));
    return this;
  },
  pushGlobalTransform: function pushGlobalTransform(t) {
    this.tIndex = push(this.transforms, this.tIndex, t);
    return this;
  },
  popTransform: function popTransform() {
    this.tIndex = pop(this.tIndex, this.tLowerBound);
    return this;
  },
  sequence: function sequence(predicate, state) {

    var storeTIndex = this.tIndex;
    var storeLowerBound = this.tLowerBound;
    this.tLowerBound = this.tIndex;
    predicate(this, state);

    this.tIndex = storeTIndex;
    this.tLowerBound = storeLowerBound;

    return this;
  },
  branch: function branch(predicate, configuration) {
    configuration = configuration || {};
    configuration.instructor = configuration.instructor || this.instructor;
    var branch = applySequenceConfiguration(Object.create(Object.getPrototypeOf(this)), configuration);

    this.getTransform(branch.transforms);
    branch.tLowerBound = 2;

    predicate(branch, configuration.state);

    return capInstructions(branch.instructions, branch.iIndex);
  }
};

var passthroughProjection = function passthroughProjection(out, p) {
  out[0] = p[0];
  out[1] = p[1];
  return out;
};

var carve = function carve(canvasContext, configuration) {

  if (configuration !== undefined && (typeof configuration === 'undefined' ? 'undefined' : _typeof(configuration)) !== 'object') {
    throw TypeError('configuration must be an object');
  }
  configuration = configuration || {};

  var projection = void 0;
  if (configuration.projection !== undefined) {
    if (typeof configuration.projection === 'function') {
      projection = configuration.projection;
    } else {
      throw TypeError('configuration.projection must be a function');
    }
  } else {
    projection = passthroughProjection;
  }

  var builtInstructions = instructions(canvasContext, projection);
  var operations = [];
  operations[instructionCodes.moveTo] = builtInstructions.moveTo;
  operations[instructionCodes.lineTo] = builtInstructions.lineTo;
  operations[instructionCodes.quadTo] = builtInstructions.quadTo;
  operations[instructionCodes.bezierTo] = builtInstructions.bezierTo;

  var commit = function commit(instructions$$1) {
    var iIndex = 0;
    while (iIndex < instructions$$1.length && instructions$$1[iIndex] != -1) {
      iIndex = operations[instructions$$1[iIndex]](instructions$$1, iIndex);
    }
  };

  var commitSequence = function commitSequence(predicate) {
    var instructions$$1 = capInstructions(this.instructions, this.iIndex);
    var executeCommit = function executeCommit() {
      commit(instructions$$1);
    };
    if (typeof predicate === 'function') {
      predicate(canvasContext, executeCommit);
    } else executeCommit();
    this.iIndex = 0;
    return this;
  };

  var carveCtx = applySequenceConfiguration(Object.create(Object.assign({}, { commit: commitSequence }, sequenceActions)), configuration);

  return {
    sequence: function sequence(predicate, state) {
      predicate(carveCtx, state);
      return carveCtx.instructions;
    },
    commit: commit
  };
};

exports.carve = carve;
exports['default'] = carve;

Object.defineProperty(exports, '__esModule', { value: true });

})));