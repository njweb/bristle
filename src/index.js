import buildContext from './context'
import renderer from './renderer'

const bristle = (configuration) => {
  const bristleContext = buildContext(configuration);
  return {
    path: (predicate, state) => {
      predicate(bristleContext, state);
      return bristleContext.instructions;
    },
    render: (configuration, instructions) => {
      const bristleRenderer = renderer(configuration);
      if (instructions) {
        if (process.env.NODE_ENV !== "production") {
          if (!Array.isArray(instructions)) {
            throw Error('Must provide instructions as an array');
          }
        }
        return bristleRenderer(instructions);
      } else {
        return bristleRenderer;
      }
    }
  }
};
export default bristle;