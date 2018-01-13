export const applyTransform = (outPoint, point, transform) => {
  outPoint[0] = point[0] + transform[0];
  outPoint[1] = point[1] + transform[1];
  return outPoint;
};

export const applyScalarTransform = (scalar, transform) => {
  return scalar;
};