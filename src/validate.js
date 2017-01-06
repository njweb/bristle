export let validatePoint = (p) => {
  if(!Array.isArray(p)) return "value must be an array";
  if(typeof p[0] !== 'number' || Number.isNaN(p[0])) return "The X ([0]) component must be a number";
  if(typeof p[0] !== 'number' || Number.isNaN(p[0])) return "The Y ([1]) component must be a number";
  return undefined;
};