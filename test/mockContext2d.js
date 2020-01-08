const mockContext2d = () => {
  const savedInstructions = [];
  return {
    moveTo: (...args) => {
      savedInstructions.push(['move', args]);
    },
    lineTo: (...args) => {
      savedInstructions.push(['line', args]);
    },
    quadraticCurveTo: (...args) => {
      savedInstructions.push(['quad', args]);
    },
    bezierCurveTo: (...args) => {
      savedInstructions.push(['bezier', args]);
    },
    savedInstructions,
  };
};

export default mockContext2d;
