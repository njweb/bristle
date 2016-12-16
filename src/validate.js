export let validatePoint = (p) => {
  if(!Array.isArray(p)) return "Point must be an array";
  if(typeof p[0] !== 'number' || Number.isNaN(p[0])) return "The point's X component must be a number";
  if(typeof p[0] !== 'number' || Number.isNaN(p[0])) return "The point's Y component must be a number";
  return undefined;
};