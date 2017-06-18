import codes from './codes'
import operations from './operations'

const canvasRenderOperations = [];
canvasRenderOperations[codes.move] = operations.move;
canvasRenderOperations[codes.line] = operations.line;
canvasRenderOperations[codes.quad] = operations.quad;
canvasRenderOperations[codes.bezier] = operations.bezier;
canvasRenderOperations[codes.arc] = operations.arc;

const canvasRenderContext = { canvasRenderOperations };

export default (configuration) => {
  if(typeof configuration.projection !== 'function') {
    throw Error('Render configuration must provide a projection function');
  }
  if(typeof configuration.canvasContext2D !== 'object') {
    throw Error('Render canvasContext2D must be an object');
  }

  const renderContext = Object.assign({}, canvasRenderContext, {
    projection: configuration.projection,
    canvasContext2D: configuration.canvasContext2D
  });

  const bristleRenderer = function bristleRenderer(instructions) {
    let index = 1;
    while (index < instructions[0]) {
      index = renderContext.canvasRenderOperations[instructions[index]](
        renderContext.projection,
        renderContext.canvasContext2D,
        instructions,
        index);
    }
    return bristleRenderer;
  };

  return bristleRenderer;
};