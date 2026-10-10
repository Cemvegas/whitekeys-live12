const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/whitekeys-midi.js','utf8');
let checks=0;
function make(){let output=[];let c={outlet:(_,v)=>output.push(v),arrayfromargs:a=>Array.from(a)};vm.createContext(c);vm.runInContext(src,c);c.output=output;c.feed=a=>a.forEach(b=>c.msg_int(b));c.take=()=>output.splice(0);return c;}
function eq(a,b){assert.deepStrictEqual(a,b);checks++;}
const major=[0,2,4,5,7,9,11],minor=[0,2,3,5,7,8,10],white=[0,2,4,5,7,9,11];
for(let r=0;r<12;r++)for(let ints of [major,minor,[0,2,3,5,7,9,10]])for(let n=0;n<128;n++){
 let c=make();c.configure(r,...ints);let deg=white.indexOf(n%12),out=deg<0?n:12*Math.floor(n/12)+r+ints[deg];
 c.feed([0x93,n,99,0x83,n,45]);eq(c.take(),out>127?[]:[0x93,out,99,0x83,out,45]);
}
let c=make();c.configure(0,...minor);c.feed([144,64,110]);c.configure(2,...major);c.feed([128,64,53]);eq(c.take(),[144,63,110,128,63,53]);
c=make();c.configure(0,...minor);c.feed([144,64,80,64,0]);eq(c.take(),[144,63,80,144,63,0]);
c=make();c.configure(0,...minor);c.blackkeys(1);c.feed([144,61,80]);c.blackkeys(0);c.feed([128,61,64]);eq(c.take(),[]);
c.feed([144,61,80]);c.blackkeys(1);c.feed([128,61,40]);eq(c.take(),[144,61,80,128,61,40]);
c=make();c.configure(0,...minor);c.feed([144,64,80,63,100,128,64,40]);eq(c.take(),[144,63,80,144,63,100]);c.feed([128,63,60]);eq(c.take(),[128,63,60]);
c=make();c.configure(0,...minor);c.feed([144,64,40,64,60,128,64,10,64,20]);eq(c.take(),[144,63,40,144,63,60,128,63,20]);
c=make();c.configure(0,...minor);c.feed([144,64,80,145,64,81,128,64,40,129,64,41]);eq(c.take(),[144,63,80,145,63,81,128,63,40,129,63,41]);
c=make();c.configure(0,0,2,4,7,9);c.feed([144,60,80,128,60,40]);eq(c.take(),[]);
c=make();c.configure(0,...minor);c.feed([176,64,127,224,0,64,192,5,208,80,242,1,2,240,1,248,2,247]);eq(c.take(),[176,64,127,224,0,64,192,5,208,80,242,1,2,240,1,248,2,247]);
c=make();c.configure(0,...minor);c.feed([144,64,80,160,64,90,128,64,12]);eq(c.take(),[144,63,80,160,63,90,128,63,12]);
c=make();c.configure(0,...minor);c.feed([144,64,80]);c.take();c.panic();assert(c.take().slice(0,3).join()==='128,63,0');eq(Object.keys(c.pending),[]);eq(Object.keys(c.counts),[]);
c=make();c.configure(0,...minor);c.feed([144,64,80,176,123,0,128,64,40]);eq(c.take(),[144,63,80,176,123,0]);
console.log(`${checks} assertions passed (all 128 notes x 12 roots x 3 scales plus MIDI edge cases)`);
