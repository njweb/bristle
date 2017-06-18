(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.bristle = factory());
}(this, (function () { 'use strict';

var codes = {
  nil: -1,
  move: 0,
  line: 1,
  bezier: 2,
  quad: 3,
  arc: 4
};

var isNumber = function isNumber(n) {
  return typeof n === 'number' && !Number.isNaN(n);
};

var validatePoint = function validatePoint(p) {
  if (!Array.isArray(p) && !(ArrayBuffer.isView(p) && !(p instanceof DataView))) {
    return "value must be an array or ArrayBuffer view";
  }
  if (!isNumber(p[0])) return "The X ([0]) component must be a number";
  if (!isNumber(p[1])) return "The Y ([1]) component must be a number";
  return undefined;
};

var move$1 = function move(outInstructions, index, point) {

  {
    var result = void 0;
    if (result = validatePoint(point)) throw TypeError(result);
  }

  outInstructions[index] = codes.move;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
var line$1 = function line(outInstructions, index, point) {

  {
    var result = void 0;
    if (result = validatePoint(point)) throw TypeError(result);
  }

  outInstructions[index] = codes.line;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  return index += 3;
};
var quad$1 = function quad(outInstructions, index, control, point) {

  {
    var result = void 0;
    if (result = validatePoint(control)) throw TypeError('control: ' + result);
    if (result = validatePoint(point)) throw TypeError('point: ' + result);
  }

  outInstructions[index] = codes.quad;
  outInstructions[index + 1] = control[0];
  outInstructions[index + 2] = control[1];
  outInstructions[index + 3] = point[0];
  outInstructions[index + 4] = point[1];
  return index += 5;
};

var bezier$1 = function bezier(outInstructions, index, controlA, controlB, point) {

  {
    var result = void 0;
    if (result = validatePoint(controlA)) throw TypeError('controlA: ' + result);
    if (result = validatePoint(controlB)) throw TypeError('controlB: ' + result);
    if (result = validatePoint(point)) throw TypeError('point: ' + result);
  }

  outInstructions[index] = codes.bezier;
  outInstructions[index + 1] = controlA[0];
  outInstructions[index + 2] = controlA[1];
  outInstructions[index + 3] = controlB[0];
  outInstructions[index + 4] = controlB[1];
  outInstructions[index + 5] = point[0];
  outInstructions[index + 6] = point[1];
  return index + 7;
};

var arc$1 = function arc(outInstructions, index, point, radius, startAngle, endAngle, isCCW) {

  {
    var result = void 0;
    if (result = validatePoint(point)) throw TypeError('point: ' + result);
    if (!isNumber(radius)) throw TypeError('radius must be a number');
    if (!isNumber(startAngle)) throw TypeError('start angle must be a number');
    if (!isNumber(endAngle)) throw TypeError('end angle must be a number');
  }

  outInstructions[index] = codes.arc;
  outInstructions[index + 1] = point[0];
  outInstructions[index + 2] = point[1];
  outInstructions[index + 3] = radius;
  outInstructions[index + 4] = startAngle;
  outInstructions[index + 5] = endAngle;
  outInstructions[index + 6] = isCCW === true ? 1 : 0;
  return index + 7;
};

var instructions = { move: move$1, line: line$1, quad: quad$1, bezier: bezier$1, arc: arc$1 };

var pointCacheBuffer = new ArrayBuffer(24);
var cache = [new Float32Array(pointCacheBuffer, 0, 2), new Float32Array(pointCacheBuffer, 4 * 2, 2), new Float32Array(pointCacheBuffer, 4 * 4, 2)];

function move$$1(point) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  this.instructions[0] = instructions.move(this.instructions, this.instructions[0], point);
  return this;
}
function line$$1(point) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  this.instructions[0] = instructions.line(this.instructions, this.instructions[0], point);
  return this;
}
function draw(point) {
  if (this.instructions[0] === 1) {
    return this.move(point);
  } else {
    return this.line(point);
  }
}
function quad$$1(point, control) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  control = this.applyTransform(cache[1], this.currentTransform, control);
  this.instructions[0] = instructions.quad(this.instructions, this.instructions[0], point, control);
  return this;
}
function bezier$$1(point, controlA, controlB) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  controlA = this.applyTransform(cache[1], this.currentTransform, controlA);
  controlB = this.applyTransform(cache[2], this.currentTransform, controlB);
  this.instructions[0] = instructions.bezier(this.instructions, this.instructions[0], point, controlA, controlB);
  return this;
}
function arc$$1(point, radius, startAngle, endAngle, isCCW) {
  point = this.applyTransform(cache[0], this.currentTransform, point);
  this.instructions[0] = instructions.arc(this.instructions, this.instructions[0], point, radius, startAngle, endAngle, isCCW);
  return this;
}
function seq(transform, sequencer, state) {
  var storedTransform = [];
  storedTransform[0] = this.currentTransform[0];
  storedTransform[1] = this.currentTransform[1];

  this.currentTransform = this.mergeTransforms(this.currentTransform, storedTransform, transform);

  sequencer(this, state ? state : this.state);

  this.currentTransform[0] = storedTransform[0];
  this.currentTransform[1] = storedTransform[1];

  return this;
}
function localSeq(sequencer, state) {
  sequencer(this, state ? state : this.state);
  return this;
}

var actions = { seq: seq, localSeq: localSeq, move: move$$1, line: line$$1, draw: draw, quad: quad$$1, bezier: bezier$$1, arc: arc$$1 };

var merge = function merge(out, transformA, transformB) {
  out[0] = transformA[0] + transformB[0];
  out[1] = transformA[1] + transformB[1];
  return out;
};

var apply = function apply(out, transform, point) {
  return merge(out, transform, point);
};

var applyCurrent = function applyCurrent(out, point) {
  return apply(out, this.currentTransform, point);
};

var transforms = { merge: merge, apply: apply, applyCurrent: applyCurrent };

var baseContext = {
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

var buildContext = (function (configuration) {

  configuration = configuration || { instructions: [] };

  {
    if (!Array.isArray(configuration.instructions)) {
      throw new Error('Must provide an instructions array when creating a new context');
    }
    if (configuration.currentTransform && configuration.currentTransform.length < 2) {
      throw new Error('Current transform array must have at least length of 2');
    }
  }

  configuration.instructions[0] = 1;

  return Object.assign({}, baseContext, {
    instructions: configuration.instructions,
    currentTransform: configuration.transform || [0, 0]
  });
});

var pointCacheBuffer$1 = new ArrayBuffer(24);
var cache$1 = [new Float32Array(pointCacheBuffer$1, 0, 2), new Float32Array(pointCacheBuffer$1, 4 * 2, 2), new Float32Array(pointCacheBuffer$1, 4 * 4, 2)];

var move$2 = function move(projection, canvasContext2D, instructions, index) {
  var point = projection(cache$1[0], instructions.slice(index + 1, index + 3));
  canvasContext2D.moveTo(point[0], point[1]);
  return index + 3;
};

var line$2 = function line(projection, canvasContext2D, instructions, index) {
  var point = projection(cache$1[0], instructions.slice(index + 1, index + 3));
  canvasContext2D.lineTo(point[0], point[1]);
  return index + 3;
};

var quad$2 = function quad(projection, canvasContext2D, instructions, index) {
  var control = projection(cache$1[0], instructions.slice(index + 1, index + 3));
  var point = projection(cache$1[1], instructions.slice(index + 3, index + 5));
  canvasContext2D.quadraticCurveTo(control[0], control[1], point[0], point[1]);
  return index + 5;
};

var bezier$2 = function bezier(projection, canvasContext2D, instructions, index) {
  var controlA = projection(cache$1[0], instructions.slice(index + 1, index + 3));
  var controlB = projection(cache$1[1], instructions.slice(index + 3, index + 5));
  var point = projection(cache$1[2], instructions.slice(index + 5, index + 7));
  canvasContext2D.bezierCurveTo(controlA[0], controlA[1], controlB[0], controlB[1], point[0], point[1]);
  return index + 7;
};

var arc$2 = function arc(projection, canvasContext2D, instructions, index) {
  var point = projection(cache$1[0], instructions.slice(index + 1, index + 3));
  var isCCW = instructions[index + 6] !== 0;
  canvasContext2D.arc(point[0], point[1], instructions[index + 3], instructions[index + 4], instructions[index + 5], isCCW);
  return index + 7;
};

var operations = { move: move$2, line: line$2, quad: quad$2, bezier: bezier$2, arc: arc$2 };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var renderOperations = [];
renderOperations[codes.move] = operations.move;
renderOperations[codes.line] = operations.line;
renderOperations[codes.quad] = operations.quad;
renderOperations[codes.bezier] = operations.bezier;
renderOperations[codes.arc] = operations.arc;

var baseRenderContext = { renderOperations: renderOperations };

var renderer = (function (configuration) {
  if (typeof configuration.projection !== 'function') {
    throw Error('Render configuration must provide a projection function');
  }
  if (_typeof(configuration.canvasContext2D) !== 'object') {
    throw Error('Render canvasContext2D must be an object');
  }

  var renderContext = Object.assign({}, baseRenderContext, {
    projection: configuration.projection,
    canvasContext2D: configuration.canvasContext2D
  });

  var bristleRenderer = function bristleRenderer(instructions) {
    var index = 1;
    while (index < instructions[0]) {
      index = renderContext.renderOperations[instructions[index]](renderContext.projection, renderContext.canvasContext2D, instructions, index);
    }
    return bristleRenderer;
  };

  return bristleRenderer;
});

var bristle = function bristle(configuration) {
  var bristleContext = buildContext(configuration);
  return {
    path: function path(predicate, state) {
      predicate(bristleContext, state);
      return bristleContext.instructions;
    },
    render: function render(configuration, instructions) {
      var bristleRenderer = renderer(configuration);
      if (instructions) {
        {
          if (!Array.isArray(instructions)) {
            throw Error('Must provide instructions as an array');
          }
        }
        return bristleRenderer(instructions);
      } else {
        return bristleRenderer;
      }
    }
  };
};

return bristle;

})));
