import bristle from '../src/bristle'
import {
  fromTranslation as mat2dFromTranslation,
  multiply as mat2dMultiply
} from "../src/glMatrix/mat2d";

describe('bristle paths', () => {
  it('should handle muliple sequetial path functions correctly', () => {
    const testPath = bristle.createPath([]);

    const predicate = (ctx => {
      ctx
        .move([12, 13])
        .line([14, 13])
        .quad([16, 13], [16, 16])
        .bezier([18, 16], [22, 16], [22, 20])
        .move([28, 20])
        .line([28, 18])
        .quad([28, 16], [30, 16])
        .bezier([30, 12], [22, 10], [24, 10]);
    });

    const testInstructions = testPath(predicate);

    expect(testInstructions).toMatchSnapshot();
  });

  it('should handle branching paths correctly', () => {
    const testPath = bristle.createPath([]);

    const predicateC = (ctx => {
      ctx
        .line([-4, 0])
        .line([4, 0]);
    });
    const predicateB = (ctx => {
      ctx
        .line([-8, 0])
        .line([-4, 0])
        .branch(predicateC, mat2dMultiply(
          [],
          ctx.transform,
          mat2dFromTranslation([], [0, 10])))
        .line([0, 4])
        .line([0, 8]);
    });
    const predicateA = (ctx => {
      ctx
        .move([-16, 0])
        .line([-8, 0])
        .branch(predicateB, mat2dMultiply(
          [],
          ctx.transform,
          mat2dFromTranslation([], [0, 10])
        ))
        .line([8, 0])
        .line([16, 0]);
    });

    const testInstructions = testPath(predicateA);

    expect(testInstructions).toMatchSnapshot();
  })
});