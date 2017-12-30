import codes from './codes'
import operationsCanvas from './operations'
import operationsSVG from './operationsSVG'

const canvasRenderOperations = [];
canvasRenderOperations[codes.move] = operationsCanvas.move;
canvasRenderOperations[codes.line] = operationsCanvas.line;
canvasRenderOperations[codes.quad] = operationsCanvas.quad;
canvasRenderOperations[codes.bezier] = operationsCanvas.bezier;
canvasRenderOperations[codes.arc] = operationsCanvas.arc;

export const canvasRenderer = (configuration) => {
  if(typeof configuration.projection !== 'function') {
    throw Error('Render configuration must provide a projection function');
  }
  if(typeof configuration.canvasContext2D !== 'object') {
    throw Error('Render canvasContext2D must be an object');
  }

  const renderContext = {
    projection: configuration.projection,
    canvasContext2D: configuration.canvasContext2D
  };

  const canvasRenderer = function canvasRenderer(instructions) {
    let index = 1;
    while (index < instructions[0]) {
      index = canvasRenderOperations[instructions[index]](
        renderContext.projection,
        renderContext.canvasContext2D,
        instructions,
        index);
    }
    return canvasRenderer;
  };

  return canvasRenderer;
};

const svgRenderOperations = [];
svgRenderOperations[codes.move] = operationsSVG.move;
svgRenderOperations[codes.line] = operationsSVG.line;
svgRenderOperations[codes.quad] = operationsSVG.quad;
svgRenderOperations[codes.bezier] = operationsSVG.bezier;
svgRenderOperations[codes.arc] = operationsSVG.arc;

export const svgRenderer = (configuration) => {
  if(typeof configuration.projection !== 'function') {
    throw Error('Render configuration must provide a projection function');
  }

  const renderContext = {
    projection: configuration.projection,
    svgPathContainer: {
      value: "",
      pathTip: [0, 0]
    }
  };

  return function bristleRenderer(instructions) {
    let index = 1;
    while (index < instructions[0]) {
      index = svgRenderOperations[instructions[index]](
        renderContext.projection,
        renderContext.svgPathContainer,
        instructions,
        index);
    }
    return renderContext.svgPathContainer.value;
  };
};