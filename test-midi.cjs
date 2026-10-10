const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/whitekeys-midi.js','utf8');
let checks=0;
function make(events){let output=[],tasks=[];let c={Task:function(fn){this.cancelled=false;this.cancel=()=>this.cancelled=true;this.schedule=()=>tasks.push(this);this.run=()=>{if(!this.cancelled)fn()};this.runQueued=fn;},outlet:(i,...a)=>{if(i===0)output.push(a[0]);else if(events)events(a.length===1&&Array.isArray(a[0])?a[0]:a)},arrayfromargs:a=>Array.from(a)};vm.createContext(c);vm.runInContext(src,c);c.tasks=tasks;c.output=output;c.feed=a=>a.forEach(b=>c.msg_int(b));c.take=()=>output.splice(0);return c;}
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
c=make();c.configure(0,...minor);c.feed([144,64,80]);c.audition(63);c.feed([128,64,0]);eq(c.take(),[144,63,80,144,63,96]);c.tasks[0].run();eq(c.take(),[128,63,0]);
c=make();c.configure(0,...minor);c.audition(63);c.feed([176,120,0,144,64,81]);c.take();c.tasks[0].run();eq(c.take(),[]);c.feed([128,64,45]);eq(c.take(),[128,63,45]);
c=make();c.audition(60);c.panic();c.take();c.tasks[0].run();eq(c.take(),[]);
// #5: A cancelled timer that was already queued must not release a new voice.
for (const reset of [c=>c.panic(),c=>c.feed([255])]) {
 c=make();c.configure(0,...major);c.audition(60);const old=c.tasks[0];reset(c);c.take();
 c.feed([144,60,87]);c.take();old.runQueued();eq(c.take(),[]);
 c.feed([128,60,32]);eq(c.take(),[128,60,32]);
}
// #5: Real keyboard/model/MIDI messages connected at their public Max outlets.
function instrument(){
 let key,state,midi,painted=[],fillColor=[];
 const graphics={init(){},redraw(){},set_source_rgba(...a){fillColor=a},fill(){if(fillColor.join()==='0.97,0.76,0.41,1')painted.push(true)},text_measure(){return [5,8]}};
 for(const n of ['rectangle_rounded','rectangle','stroke','set_line_width','select_font_face','set_font_size','move_to','show_text'])graphics[n]=()=>{};
 function deliver(c,a){c[a[0]](...a.slice(1))}
 key={mgraphics:graphics,box:{rect:[0,0,350,80]},outlet:(i,...a)=>deliver(state,a)};
 vm.createContext(key);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-keyboard.js','utf8'),key);
 midi=make(a=>deliver(key,a));
 state={arrayfromargs:a=>Array.from(a),notifyclients(){},patcher:{getnamed(){return null}},outlet:(i,...a)=>deliver(i===0?midi:key,a.length===1&&Array.isArray(a[0])?a[0]:a)};
 vm.createContext(state);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),state);
 state.livescale(0,'Major',1,...major);state.init();
 return {key,state,midi,click:(x,y,option=0)=>key.onclick(x,y,1,0,0,0,option,0),saved:()=>JSON.parse(JSON.stringify(state.getvalueof())),lights:()=>{painted=[];key.paint();return painted.length}};
}
// Normal white-key editing is silent; Option-click hears Root without changing persisted mode/membership.
let device=instrument(),before=device.saved();device.click(25,70,1);
eq(device.saved(),before);eq(device.midi.take(),[144,60,96]);eq(device.lights(),1);
device.midi.tasks[0].run();eq(device.midi.take(),[128,60,0]);eq(device.lights(),0);
device.click(125,70);eq(device.midi.take(),[]);eq(device.saved().slice(1,5),[0,0,'Custom',2725]);
// Physical ignore does not disable black screen-key editing or audition.
device=instrument();device.state.blackselect(1);device.midi.feed([144,63,80,128,63,20]);eq(device.midi.take(),[]);
before=device.saved();device.click(100,10,1);eq(device.saved(),before);eq(device.midi.take(),[144,63,96]);
device.midi.tasks[0].run();eq(device.midi.take(),[128,63,0]);device.click(100,10);eq(device.saved().slice(1,5),[0,0,'Custom',2749]);eq(device.midi.take(),[]);
device.state.blackselect(0);device.midi.feed([144,63,73,128,63,31]);eq(device.midi.take(),[144,63,73,128,63,31]);
// Output pitch-class highlight lasts while another channel/octave still holds it.
device=instrument();device.midi.feed([144,60,81,145,72,82]);eq(device.lights(),1);
device.midi.feed([128,60,33]);eq(device.lights(),1);device.midi.feed([129,72,34]);eq(device.lights(),0);
// Audition can release first without closing a physical collision; Panic clears every highlight and sustain.
device=instrument();device.click(25,70,1);device.midi.feed([144,60,89]);device.midi.take();device.midi.tasks[0].run();eq(device.midi.take(),[]);eq(device.lights(),1);
device.midi.feed([128,60,37]);eq(device.midi.take(),[128,60,37]);eq(device.lights(),0);
device.click(25,70,1);device.midi.feed([145,72,84,176,64,127]);device.midi.take();device.midi.panic();let panicOut=device.midi.take();
eq(panicOut.slice(0,6),[128,60,0,129,72,0]);eq(panicOut.slice(6),Array.from({length:16},(_,ch)=>[176+ch,64,0,176+ch,123,0]).flat());eq(device.lights(),0);
device.midi.feed([144,60,79,128,60,29]);eq(device.midi.take(),[144,60,79,128,60,29]);
console.log(`${checks} assertions passed (all 128 notes x 12 roots x 3 scales plus MIDI edge cases)`);
