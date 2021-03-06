let expect = require('chai').expect;
let _ = require('lodash');

import {moveTo, lineTo, quadTo, bezierTo} from '../src/path';
import {instructionCodes} from '../src/codes';

describe('Move To', () => {
  it('should return an integer 3 larger than the index passed in', () => {
    let index = 5;
    let result = moveTo([], index, [1, 2]);
    expect(result).to.equal(index + 3);
  });
  it('should place the code for moveTo in the instructions array at the provided index', () => {
    let index = 5;
    let arr = [];
    moveTo(arr, index, [1, 2]);
    expect(arr[index]).to.equal(instructionCodes.moveTo);
  });
  it('should place the first value of the point array into the instructions array at index + 1', () => {
    let index = 8;
    let arr = [];
    let point = [4, 10];
    moveTo(arr, index, point);
    expect(arr[index + 1]).to.equal(point[0]);
  });
  it('should place the second value of the point array into the instructions array at index + 2', () => {
    let index = 2;
    let arr = [];
    let point = [4, 10];
    moveTo(arr, index, point);
    expect(arr[index + 2]).to.equal(point[1]);
  });
  it('should throw an error if the point value provided is not an array', () => {
    expect(moveTo.bind(null, [], 2, null)).to.throw(TypeError);
    expect(moveTo.bind(null, [], 3, 'abc')).to.throw(TypeError);
    expect(moveTo.bind(null, [], 4, 123)).to.throw(TypeError);
    expect(moveTo.bind(null, [], 5, {a: 'b'})).to.throw(TypeError);
  });
  it('should throw an error if the point x value is not a number', () => {
    expect(moveTo.bind(null, [], 2, [null, 10])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [NaN, 10])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, ['abc', 10])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [[7], 10])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [{}, 10])).to.throw(TypeError);
  });
  it('should throw an error if the point y value is not a number', () => {
    expect(moveTo.bind(null, [], 2, [10, null])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [10, NaN])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [10, 'abc'])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [10, [7]])).to.throw(TypeError);
    expect(moveTo.bind(null, [], 2, [10, {}])).to.throw(TypeError);
  });
});

describe('Line To', () => {
  it('should return an integer 3 larger than the index passed in', () => {
    let index = 5;
    let result = lineTo([], index, [1, 2]);
    expect(result).to.equal(index + 3);
  });
  it('should place the code for lineTo in the instructions array at the provided index', () => {
    let index = 5;
    let arr = [];
    lineTo(arr, index, [1, 2]);
    expect(arr[index]).to.equal(instructionCodes.lineTo);
  });
  it('should place the first value of the point array into the instructions array at index + 1', () => {
    let index = 8;
    let arr = [];
    let point = [4, 10];
    lineTo(arr, index, point);
    expect(arr[index + 1]).to.equal(point[0]);
  });
  it('should place the second value of the point array into the instructions array at index + 2', () => {
    let index = 2;
    let arr = [];
    let point = [4, 10];
    lineTo(arr, index, point);
    expect(arr[index + 2]).to.equal(point[1]);
  });
});

describe('Quad To', () => {
  it('should return an integer 5 larger than the index passed in', () => {
    let index = 5;
    expect(quadTo([], index, [1, 2], [3, 4])).to.equal(index + 5);
  });
  it('should place the code for quadTo in the instruction array at the index\'s value', () => {
    let index = 12;
    let arr = [];
    let control = [12, 44];
    let point = [80, 35];
    quadTo(arr, index, control, point);
    expect(arr[index]).to.equal(instructionCodes.quadTo);
  });
  //TODO auto-generate these tests---->>>>
  it('should place the first value of the control array into the instructions array at index + 1', () => {
    let index = 12;
    let arr = [];
    let control = [12, 44];
    let point = [80, 35];
    quadTo(arr, index, control, point);
    expect(arr[index + 1]).to.equal(control[0]);
  });
  it('should place the second value of the control array into the instructions array at index + 2', () => {
    let index = 12;
    let arr = [];
    let control = [12, 44];
    let point = [80, 35];
    quadTo(arr, index, control, point);
    expect(arr[index + 2]).to.equal(control[1]);
  });
  it('should place the first value of the point array into the instructions array at index + 3', () => {
    let index = 12;
    let arr = [];
    let control = [12, 44];
    let point = [80, 35];
    quadTo(arr, index, control, point);
    expect(arr[index + 3]).to.equal(point[0]);
  });
  it('should place the first value of the point array into the instructions array at index + 3', () => {
    let index = 12;
    let arr = [];
    let control = [12, 44];
    let point = [80, 35];
    quadTo(arr, index, control, point);
    expect(arr[index + 4]).to.equal(point[1]);
  });
});

describe('Bezier To', () => {
  it('should return an integer 7 larger than the index passed in', () => {
    let index = 5;
    expect(bezierTo([], index, [1, 2], [3, 4], [5, 6])).to.equal(index + 7);
  });
  it('should place the code for bezierTo in the instruction array at the index\'s value', () => {
    let index = 5;
    let arr = [];
    bezierTo(arr, index, [1, 2], [3, 4], [5, 6]);
    expect(arr[index]).to.equal(instructionCodes.bezierTo);
  });

  let descriptionTemplate = _.template('should place the value at index ${index} of ${argName} at the correct index ' +
    'in the instruction array');
  _.forEach({controlA: 0, controlB: 1, point: 2}, (v, k) => {
    _.forEach(_.range(2), (i) => {
      it(descriptionTemplate({index: i, argName: k}), () => {
        let index = 45;
        let arr = [];
        let values = {
          controlA: [4, 5],
          controlB: [12, 30],
          point: [10, 22]
        };
        bezierTo(arr, index, values.controlA, values.controlB, values.point);
        expect(arr[index + 1 + (v * 2) + i]).to.equal(values[k][i]);
      });
    })
  })
});