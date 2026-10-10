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
c=make();c.configure(0,0,2,4,7,9);c.feed([144,60,80,128,60,40]);eq(c.take(),[144,60,80,128,60,40]);
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

// LiveAPI/Task are host boundaries; exercise the real API, state and MIDI scripts
// through their Max messages, without opening Live or inspecting model internals.
function liveChain() {
 const midi=make(), labels={}, tasks=[], subscriptions=[];
 const values={root_note:[0],scale_name:['Minor'],scale_mode:[1],scale_intervals:minor.slice()};
 let online=true;
 const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{if(a[0]==='set')labels[n]=a[1]}})},outlet:(i,...args)=>{if(i!==0)return;const a=Array.isArray(args[0])?Array.from(args[0]):args;midi[a[0]](...a.slice(1));}};
 vm.createContext(state);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),state);
 const api={post:()=>{},outlet:(i,...args)=>{if(i!==0)return;const a=Array.isArray(args[0])?Array.from(args[0]):args;state[a[0]](...a.slice(1));},Task:function(fn){this.cancel=()=>this.scheduled=false;this.schedule=delay=>{this.delay=delay;this.scheduled=true};this.run=()=>{if(this.scheduled){this.scheduled=false;fn()}};tasks.push(this);},LiveAPI:function(callback,path){assert.strictEqual(path,'live_set');let id=online?1:0;Object.defineProperty(this,'id',{get:()=>id,set:v=>{id=v;if(callback)callback(['id',v]);}});this.get=p=>{if(!online)throw Error('connection lost');return values[p].slice()};Object.defineProperty(this,'property',{get:()=>this.prop,set:p=>{this.prop=p;}});this.callback=callback;subscriptions.push(this);}};
 vm.createContext(api);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-api.js','utf8'),api);
 return {api,state,midi,labels,values,tasks,subscriptions,setOnline:v=>online=v,flush:delay=>tasks.filter(t=>t.scheduled&&t.delay===delay).slice().forEach(t=>t.run()),change:()=>subscriptions.filter(s=>s.property).forEach(s=>s.callback(['root_note',values.root_note[0]]))};
}
let live=liveChain();live.state.init();live.api.init();
eq(live.subscriptions.filter(s=>s.property).map(s=>s.property),['root_note','scale_intervals','scale_name','scale_mode']);
live.midi.feed([144,64,91]);eq(live.midi.take(),[144,63,91]);
live.values.root_note=[2];live.values.scale_name=['Dorian'];live.values.scale_intervals=[0,2,3,5,7,9,10];live.change();live.flush(0);
live.midi.feed([128,64,39,144,64,77,128,64,23]);eq(live.midi.take(),[128,63,39,144,65,77,128,65,23]);
live.state.scaleselect(1);live.values.root_note=[7];live.change();live.flush(0);live.midi.feed([144,60,80,128,60,30]);eq(live.midi.take(),[144,62,80,128,62,30]);
live.state.followselect(1);live.midi.feed([144,60,80,128,60,30]);eq(live.midi.take(),[144,67,80,128,67,30]);
live.values.scale_mode=[0];live.change();live.flush(0);eq(live.labels.status_label,'Playing: G Dorian (7 notes) - Scale Mode off');
live.midi.feed([144,64,90]);eq(live.midi.take(),[144,70,90]);
live.values.scale_intervals=[0,2,4,7,9];live.change();live.flush(0);live.midi.feed([144,60,80,128,64,35,144,61,60,128,61,20]);eq(live.midi.take(),[144,67,80,128,70,35,144,61,60,128,61,20]);eq(live.labels.status_label,'Playing: G Dorian (5 notes) - Scale Mode off');
live.setOnline(false);live.change();live.flush(0);eq(live.labels.status_label,'Live unavailable');
// Disconnect immediately detaches the old host observers, before retrying.
eq(live.subscriptions.filter(s=>s.property).length,0);
live.setOnline(true);live.values.scale_intervals=major.slice();live.values.root_note=[0];live.flush(1000);live.midi.feed([144,64,82,128,64,42]);eq(live.midi.take(),[144,64,82,128,64,42]);
live.api.notifydeleted();eq(live.subscriptions.filter(s=>s.property).length,0);eq(live.tasks.filter(t=>t.scheduled).length,0);
console.log('Live observer → state → MIDI message scenarios passed');
// API may become available only after device initialization.
live=liveChain();live.state.init();live.setOnline(false);live.api.init();eq(live.labels.status_label,'Live unavailable');live.midi.feed([144,60,80,128,60,40]);eq(live.midi.take(),[]);live.setOnline(true);live.flush(1000);live.midi.feed([144,64,88,128,64,32]);eq(live.midi.take(),[144,63,88,128,63,32]);live.api.notifydeleted();
// Channel independence and collision/retrigger release velocity at all 16 channels.
for(let ch=0;ch<16;ch++){
 c=make();c.configure(0,...minor);c.feed([144+ch,64,70,63,100,64,93,128+ch,64,10,63,20,64,44]);eq(c.take(),[144+ch,63,70,144+ch,63,100,144+ch,63,93,128+ch,63,44]);
}
// Object-loss callbacks can be the only host notification: no property event follows.
live=liveChain();live.state.init();live.api.init();live.midi.feed([144,64,90]);eq(live.midi.take(),[144,63,90]);
const oldObserver=live.subscriptions.find(s=>s.property);
live.setOnline(false);oldObserver.id=0;
eq(live.labels.status_label,'Live unavailable');
live.midi.feed([144,60,80,128,60,15,128,64,37,144,61,70,128,61,29]);eq(live.midi.take(),[128,63,37,144,61,70,128,61,29]);
eq(live.tasks.filter(t=>t.scheduled).map(t=>t.delay),[1000]);
live.setOnline(true);live.values.root_note=[2];live.values.scale_name=['Dorian'];live.values.scale_intervals=[0,2,3,5,7,9,10];live.flush(1000);
live.midi.feed([144,60,82,128,60,33]);eq(live.midi.take(),[144,62,82,128,62,33]);
// A queued callback belonging to the detached observer must not disrupt recovery.
oldObserver.callback(['id',0]);eq(live.labels.status_label,'Playing: D Dorian (7 notes)');eq(live.tasks.filter(t=>t.scheduled).length,0);
live.state.scaleselect(1);live.subscriptions.find(s=>s.property).id=0;
live.midi.feed([144,64,83,128,64,34]);eq(live.midi.take(),[144,65,83,128,65,34]);
live.api.notifydeleted();eq(live.tasks.filter(t=>t.scheduled).length,0);
// Invalid song IDs must be rejected even when the host getters retain old data.
live=liveChain();live.state.init();live.api.init();live.subscriptions[0].id=0;live.change();live.flush(0);
eq(live.labels.status_label,'Live unavailable');live.midi.feed([144,60,84,128,60,35]);eq(live.midi.take(),[]);
eq(live.tasks.filter(t=>t.scheduled).map(t=>t.delay),[1000]);live.api.notifydeleted();eq(live.tasks.filter(t=>t.scheduled).length,0);
console.log(`${checks} total MIDI/API message assertions passed`);
// Spec #9: literal Continuous Degrees examples at the public raw MIDI seam.
for (const [ints,notes,pitches] of [
 [[0,2,3,5,6,7,9,10],[59,60,62,64,65,67,69,71,72,74],[58,60,62,63,65,66,67,69,70,72]],
 [[0,2,4,7,9],[59,60,62,64,65,67,69],[57,60,62,64,67,69,72]],
 [[0],[59,60,62,64],[48,60,72,84]],
 [[0,1,2,3,4,5,6,7,8,9,10,11],[60,62,64,65,67,69,71,72,74,76,77,79,81],[60,61,62,63,64,65,66,67,68,69,70,71,72]]
]) {
 c=make();c.configure(0,...ints);
 notes.forEach((n,i)=>{c.feed([144,n,91,128,n,27]);eq(c.take(),[144,pitches[i],91,128,pitches[i],27]);});
}
console.log(checks+' total MIDI/API and variable-scale assertions passed');
// #12 / VS18: Eight-degree white/black collisions retain all sixteen independent owners.
const octatonic=[0,2,3,5,6,7,9,10];
c=make();c.configure(0,...octatonic);
for(let ch=0;ch<16;ch++) {
 c.feed([144+ch,64,70,63,100,64,93]);
 eq(c.take(),[144+ch,63,70,144+ch,63,100,144+ch,63,93]);
}
for(let ch=0;ch<16;ch++) {
 c.feed([128+ch,64,10,63,20]);eq(c.take(),[]);
 c.feed([128+ch,64,44]);eq(c.take(),[128+ch,63,44]);
}
// FIFO retriggers and poly pressure follow each held target across a scale change.
c=make();c.configure(0,...octatonic);c.feed([147,64,81]);eq(c.take(),[147,63,81]);
c.configure(0,0);c.feed([147,64,97,163,64,92]);eq(c.take(),[147,84,97,163,63,92,163,84,92]);
c.feed([131,64,21,163,64,78,147,64,0]);eq(c.take(),[131,63,21,163,84,78,147,84,0]);
// VS21: Suppressed retriggers occupy their FIFO slot without emitting ghost releases.
c=make();c.configure(0,0);c.feed([144,72,88]);eq(c.take(),[]);
c.configure(0,...octatonic);c.feed([144,72,99,128,72,13]);eq(c.take(),[144,70,99]);
c.feed([128,72,47]);eq(c.take(),[128,70,47]);
c=make();c.configure(0,0);c.feed([144,50,80,128,50,22,144,52,89,128,52,31]);eq(c.take(),[144,0,89,128,0,31]);
c.configure(7,0);c.feed([144,69,91,128,69,32,144,71,92,128,71,33]);eq(c.take(),[144,127,91,128,127,32]);
c.configure(0,0,1,2,3,4,5,6,7,8,9,10,11);c.feed([144,0,90,128,0,34,144,127,93,128,127,35]);eq(c.take(),[144,25,90,128,25,34,144,99,93,128,99,35]);
// VS22: Running status, release velocities, real-time interleaving and unrelated MIDI survive.
c=make();c.configure(0,...octatonic);
c.feed([146,64,248,79,64,0,178,64,127,226,0,64,194,5,210,80,242,1,2,240,1,248,2,247]);
eq(c.take(),[248,146,63,79,146,63,0,178,64,127,226,0,64,194,5,210,80,242,1,2,240,1,248,2,247]);
// VS19/20: Real screen audition remains independent of variable scale and physical ignore.
for(const [x,y,pitch] of [[25,70,60],[100,10,63],[50,10,61]]) {
 device=instrument();device.state.livescale(0,'Octatonic',1,...octatonic);device.state.modeselect(0);device.state.blackselect(1);
 before=device.saved();device.click(x,y,1);eq(device.saved(),before);eq(device.midi.take(),[144,pitch,96]);eq(device.lights(),1);
 device.midi.tasks[0].run();eq(device.midi.take(),[128,pitch,0]);eq(device.lights(),0);
}
// Variable mapped octaves and channels keep the shared pitch-class light until last release.
device=instrument();device.state.livescale(0,'Octatonic',1,...octatonic);
device.midi.feed([144,60,81,145,74,82]);eq(device.midi.take(),[144,60,81,145,72,82]);eq(device.lights(),1);
device.midi.feed([128,60,33]);eq(device.midi.take(),[128,60,33]);eq(device.lights(),1);
device.midi.feed([129,74,34]);eq(device.midi.take(),[129,72,34]);eq(device.lights(),0);
// Panic/system reset invalidate an already queued audition even if the new target collides.
for(const reset of [m=>m.panic(),m=>m.feed([255])]) {
 device=instrument();device.state.livescale(0,'Octatonic',1,...octatonic);device.click(100,10,1);
 const stale=device.midi.tasks[0];device.midi.feed([145,74,83,176,64,127]);device.midi.take();reset(device.midi);
 const out=device.midi.take();
 if(out[0]===255)eq(out,[255]);
 else eq(out,[128,63,0,129,72,0,...Array.from({length:16},(_,ch)=>[176+ch,64,0,176+ch,123,0]).flat()]);
 eq(device.lights(),0);device.midi.feed([144,64,85]);eq(device.midi.take(),[144,63,85]);
 stale.runQueued();eq(device.midi.take(),[]);eq(device.lights(),1);
 device.midi.feed([128,64,49]);eq(device.midi.take(),[128,63,49]);eq(device.lights(),0);
}
// Live and mode transitions never retarget held notes, including pending poly pressure.
live=liveChain();live.state.init();live.api.init();live.values.scale_intervals=octatonic.slice();live.change();live.flush(0);
live.state.modeselect(0);live.midi.feed([144,72,95]);eq(live.midi.take(),[144,70,95]);
live.values.root_note=[7];live.values.scale_intervals=[0];live.change();live.flush(0);live.state.modeselect(1);
live.midi.feed([160,72,77,128,72,41,144,69,94,128,69,42]);eq(live.midi.take(),[160,70,77,128,70,41,144,127,94,128,127,42]);
live.api.notifydeleted();
console.log(checks+' final MIDI/API/variable performance assertions passed');
