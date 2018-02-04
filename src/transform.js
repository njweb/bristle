export const applyScalarTransform = (scalar, transform) => {
  return scalar * ((transform[0] + transform[3]) / 2);
};