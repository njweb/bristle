const _isTypedArray = a => !!(a.BYTES_PER_ELEMENT && a.buffer instanceof ArrayBuffer);
const _isValidNumber = num => typeof num === 'number' && !Number.isNaN(num);
const _preparePrefix = prefix => prefix ? `${prefix} ` : '';

export const validatePoint = (point, msgPrefix) => {
  const computedPrefix = msgPrefix ? `${msgPrefix} ` : '';
  if (!Array.isArray(point) || !_isTypedArray(point)) {
    console.error(`${_preparePrefix(msgPrefix)}point is not an array or TypedArray`);
    return;
  } else if (point.length < 2) {
    console.error(`${_preparePrefix(msgPrefix)}point must have length of at least 2`);
    return;
  }

  point.forEach((value, index) => {
    if(!_isValidNumber(value)) {
      console.error(`${_preparePrefix(msgPrefix)}point[${index}] is not a number`);
    }
  });
};

export const validateMat2d = (mat2d, msgPrefix) => {
  if(!Array.isArray(mat2d) || !_isTypedArray(mat2d)) {
    console.error(`${_preparePrefix(msgPrefix)}mat2d is not an array or TypedArray`);
  } else if (mat2d.length < 6) {
    console.error(`${_preparePrefix(msgPrefix)}mat2d must have length of at least 6`);
  }

  mat2d.forEach((value, index) => {
    if(!_isValidNumber(value)) {
      console.error(`${_preparePrefix(msgPrefix)}mat2d[${index}] is not a number`);
    }
  });
};