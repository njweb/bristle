export let isNumber = (n) => {
  return typeof n === 'number' && !Number.isNaN(n);
};

export let validatePoint = (p) => {
  if(!Array.isArray(p)) return "value must be an array";
  if(!isNumber(p[0])) return "The X ([0]) component must be a number";
  if(!isNumber(p[1])) return "The Y ([1]) component must be a number";
  return undefined;
};

