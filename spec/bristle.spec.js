let expect = require('chai').expect;
let _ = require('lodash');
import bristle from '../src/index';
import {apply as applyTransform} from '../src/transforms';
import {instructionCodes} from '../src/codes'
import {canvasRenderingContext2DMock} from './canvasRenderingContext2D.mock.js';

let mockCanvasCtx2D = canvasRenderingContext2DMock();
let addPoints = (a, b) => [a[0] + b[0], a[1] + b[1]];

describe('Bristle', () => {
  describe('shape', () => {
    it('should return a function', () => {
      expect(bristle.shape({})).to.be.a('function');
    });
  });
  describe('render', () => {
    it('should be a function', () => {
      expect(bristle.render).to.be.a('function');
    })
  })
});