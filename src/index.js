import buildContext from './context'
import {canvasRenderer, svgRenderer} from './renderer'

const bristle = (configuration) => {
  const bristleContext = buildContext(configuration);
  return {
    path: (predicate, state) => {
      predicate(bristleContext, state);
      return bristleContext.instructions;
    },
    render: (configuration, instructions) => {
      const renderer = canvasRenderer(configuration);
      if (instructions) {
        if (process.env.NODE_ENV !== "production") {
          if (!Array.isArray(instructions)) {
            throw Error('Must provide instructions as an array');
          }
        }
        return renderer(instructions);
      } else {
        return renderer;
      }
    },
    renderSVG: (configuration, instructions) => {
      const renderer = svgRenderer(configuration);
      if (instructions) {
        if (process.env.NODE_ENV !== 'production') {
          if (!Array.isArray(instructions)) {
            throw Error('Must provide instructions as an array');
          }
          return renderer(instructions);
        }
      } else {
        return renderer;
      }
    }
  }
};
export default bristle;