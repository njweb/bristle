const _isTypedArray = a => !!(a.BYTES_PER_ELEMENT && a.buffer instanceof ArrayBuffer);

export default (point, msgPrefix) => {
  const computedPrefix = msgPrefix ? `${msgPrefix} ` : '';
  if (!Array.isArray(point) && !_isTypedArray(point)) {
    console.error(`${computedPrefix}point argument is not an array or TypedArray`);
  } else if (!(typeof point[0] === 'number') || Number.isNaN(point[0])) {
    console.error(`${computedPrefix}point[0] is not a number`);
  } else if (!(typeof  point[1] === 'number') || Number.isNaN(point[1])) {
    console.error(`${computedPrefix}point[1] is not a number`);
  }
}