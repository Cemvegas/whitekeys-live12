// Fixed clock plus a separate seeded stream per VM; no changes to probe code.
let stream=0;
exports.globals=function(){
 let seed=++stream;
 class FixedDate extends Date {constructor(...args){super(...(args.length?args:[1791690000000]));}static now(){return 1791690000000;}}
 const seededMath=Object.create(Math);
 seededMath.random=function(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 return {Date:FixedDate,Math:seededMath};
};
