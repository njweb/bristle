export const merge = function merge(out, transformA, transformB) {
  out[0] = transformA[0] + transformB[0];
  out[1] = transformA[1] + transformB[1];
  return out;
};

const apply = function apply(out, transform, point) {
  return merge(out, transform, point);
};

export const applyCurrent = function applyCurrent(out, point) {
  return apply(out, this.currentTransform, point);
};

export default {merge, apply, applyCurrent};