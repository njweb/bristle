const expect = require('chai').expect;
const _ = require('lodash');
import {canvasRenderingContext2DMock} from './canvasRenderingContext2D.mock'
import bristle from '../src/index'

const mockCanvasContext2D = canvasRenderingContext2DMock();

describe('bristle', () => {
  it('should work', () => {

    const myBristle = bristle();
    expect(myBristle).to.be.an('object');
    const inst = myBristle.path((ctx) => {
      expect(ctx).to.be.an('object');
      expect(ctx.seq).to.be.a('function');
      expect(ctx.instructions).to.be.an('array');
      ctx.move([10, 0]).line([20, 0])
        .seq([50, 10], (ctx) => {
          ctx.line([5, 0]).line([-5, 0]);
        }).line([0, 10]).bezier([-5, 10], [-5, 5], [10, 0]);
    });
    expect(inst).to.be.an('array');

    expect(myBristle.render({
      projection: (out, point) => {
        out[0] = point[0];
        out[1] = point[1];
        return out;
      },
      canvasContext2D: mockCanvasContext2D
    })).to.be.a('function');

    expect(myBristle.render({
      projection: (out, point) => {
        out[0] = point[0];
        out[1] = point[1];
        return out;
      },
      canvasContext2D: mockCanvasContext2D
    }, inst)).to.be.a('function');

    console.log("STORAGE: ", mockCanvasContext2D.storage);

  });
  // it('should be able to transform', () => {
  //   const instructions = bristle.path({}, (ctx) => {
  //     ctx.push([3, 10]).push([20, 40]);
  //     ctx.draw([2, 2]);
  //     ctx.pop().line([4, 4]);
  //     expect(ctx.transforms).to.be.an('array');
  //   });
  //   console.log('INST: ', instructions);
  // });
  // it('should be able to create sub paths', () => {
  //   bristle.path({}, (ctx) => {
  //     ctx.push([10, 20]);
  //     const inst = ctx.path({}, (ctx) => {
  //       ctx.push([5, 5]).move([2, 2]);
  //     });
  //     expect(inst).to.be.an('array');
  //     expect(ctx.currentTransform()).to.eql([10, 20]);
  //   });
  // })
});