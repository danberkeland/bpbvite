// source https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
export const cartesian = (...a) => 
  a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))