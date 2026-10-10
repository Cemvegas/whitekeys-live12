const fs=require('fs'),vm=require('vm'),assert=require('assert');let assertions=0;
function load(){let events=[],ui={};const c={arrayfromargs:a=>Array.from(a),outlet:(i,...a)=>events.push([i,...a]),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>ui[n]=a})}};vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),c);c.events=events;c.uiMessages=ui;return c}
function eq(a,b){assert.deepStrictEqual(JSON.parse(JSON.stringify(a)),b);assertions++}
// The approved message seam: real Scale Keyboard -> state -> MIDI scripts.
// Host facilities (drawing, patcher UI and MIDI outlets) are boundary adapters.
function integration() {
    const midiBytes=[],labels={},views=[],scheduled=[],paintColors=[];
    let keyboard;
    const midi={Task:function(callback){this.schedule=()=>scheduled.push(callback);this.cancel=()=>{}},arrayfromargs:a=>Array.from(a),outlet:(port,...a)=>{if(port===0)midiBytes.push(...a);else{if(Array.isArray(a[0]))a=Array.from(a[0]);keyboard[a[0]](...a.slice(1));}}};
    vm.createContext(midi);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-midi.js','utf8'),midi);
    const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{if(a[0]==='set')labels[n]=a[1]}})},outlet:(port,...a)=>{
        if(Array.isArray(a[0]))a=Array.from(a[0]);
        if(port===0)midi[a[0]](...a.slice(1));
        else {views.push(a);keyboard[a[0]](...a.slice(1));}
    }};
    vm.createContext(state);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),state);
    keyboard={box:{rect:[0,0,350,70]},mgraphics:{init:()=>{},redraw:()=>{},set_source_rgba:(...a)=>paintColors.push(a),rectangle_rounded:()=>{},fill:()=>{},set_line_width:()=>{},stroke:()=>{},rectangle:()=>{},select_font_face:()=>{},set_font_size:()=>{},text_measure:()=>[4],move_to:()=>{},show_text:()=>{}},outlet:(port,command,pc)=>state[command](pc)};
    vm.createContext(keyboard);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-keyboard.js','utf8'),keyboard);
    state.livescale(0,'Major',1,0,2,4,5,7,9,11);
    return {state,labels,views,scheduled,midiBytes,paint:()=>{paintColors.length=0;keyboard.paint();return paintColors.filter(c=>c[0]===0.97&&c[1]===0.76&&c[2]===0.41).length},send:(s,n,v)=>midi.note(s,n,v),click:(x,y=69)=>keyboard.onclick(x,y,1,0,0,0,0,0),note:(n)=>{midiBytes.length=0;midi.note(144,n,91);midi.note(128,n,27);return midiBytes.slice()}};
}
let staged=integration();staged.click(125);staged.click(100,10);
eq(staged.note(64),[144,64,91,128,64,27]);
staged.state.apply();eq(staged.note(64),[144,63,91,128,63,27]);
const minor=[0,2,3,5,7,8,10],dorian=[0,2,3,5,7,9,10];let c=load();c.livescale(0,'Minor',1,...minor);eq(c.getvalueof()[1],1);c.toggle(3);eq(c.follow,0);eq(c.draft,[0,2,5,7,8,10]);eq(c.active,minor);c.toggle(4);eq(c.active,minor);c.apply();eq(c.active,[0,2,4,5,7,8,10]);c.livescale(2,'Dorian',1,...dorian);eq(c.root,0);eq(c.activeRoot,0);c.followselect(1);eq(c.root,2);eq(c.draft,dorian);c.rootselect(4);eq(c.follow,0);eq(c.activeRoot,2);c.apply();eq(c.activeRoot,4);eq(c.active,dorian);c.toggle(4);eq(c.draft,dorian);c.toggle(6);eq(c.draft.length,6);eq(c.active,dorian);c.rootselect(7);eq(c.root,7);eq(c.activeRoot,4);c.toggle(9);eq(c.draft.length,7);eq(c.activeRoot,4);c.apply();eq(c.activeRoot,7);
let restored=load();restored.setvalueof(...c.getvalueof());eq(restored.getvalueof(),Array.from(c.getvalueof()));restored.livescale(0,'Minor',1,...minor);eq(restored.root,7);eq(restored.follow,0);c=load();c.scaleselect(1);eq(c.draft,minor);eq(c.follow,0);c.apply();c.toggle(4);eq(c.draft.length,8);eq(c.active,minor);c.toggle(3);eq(c.active,minor);c.apply();eq(c.active,[0,2,4,5,7,8,10]);c.blackselect(1);eq(c.black,1);restored=load();restored.setvalueof(...c.getvalueof());eq(restored.black,1);eq(restored.active,Array.from(c.active));c=load();c.livescale(0,'Major Pentatonic',1,0,2,4,7,9);eq(c.draft.length,5);eq(c.events.some(e=>JSON.stringify(e).includes('unavailable')),false);c.toggle(5);eq(c.draft.length,6);c.toggle(11);eq(c.active,[0,2,4,7,9]);c.apply();eq(c.active,[0,2,4,5,7,9,11]);console.log(assertions+' scale-editor assertions passed');

let flow=integration();flow.click(125); // E white key: 7 -> 6
assert.match(flow.labels.status_label,/^Playing: C Major \(7 notes\)$/);assertions++;
eq(flow.views.at(-1),['view',0,2725]);eq(flow.note(64),[144,64,91,128,64,27]);
flow.click(100,10); // Eb black key: 6 -> 7
assert.match(flow.labels.status_label,/7 notes/);assertions++;
eq(flow.labels.follow_toggle,0);eq(flow.labels.scale_title,'Draft: C Custom (7 notes)');eq(flow.note(64),[144,64,91,128,64,27]);flow.state.apply();eq(flow.note(64),[144,63,91,128,63,27]);
flow=integration();flow.click(100,10); // 7 -> 8
assert.match(flow.labels.status_label,/^Playing: C Major \(7 notes\)$/);assertions++;
eq(flow.views.at(-1),['view',0,2749]);eq(flow.note(64),[144,64,91,128,64,27]);
flow.click(125);eq(flow.note(64),[144,64,91,128,64,27]);flow.state.apply();eq(flow.note(64),[144,63,91,128,63,27]);
const beforeRoot=flow.views.at(-1);flow.click(25);eq(flow.views.at(-1),beforeRoot);
flow.state.rootselect(2);eq(flow.views.at(-1),['view',2,2733]);eq(flow.note(60),[144,60,91,128,60,27]);flow.state.apply();eq(flow.note(60),[144,62,91,128,62,27]);
flow.click(175); // F is third degree at D: invalid draft, sounding root remains D
flow.state.rootselect(4);assert.match(flow.labels.status_label,/^Playing: D Custom \(7 notes\)$/);assertions++;
eq(flow.note(60),[144,62,91,128,62,27]);
flow.click(225); // G restores missing third relative to E
eq(flow.note(60),[144,62,91,128,62,27]);flow.state.apply();eq(flow.note(60),[144,64,91,128,64,27]);
flow.state.livescale(7,'Minor',1,0,2,3,5,7,8,10);
eq(flow.note(60),[144,64,91,128,64,27]);
flow.state.followselect(1);eq(flow.labels.scale_title,'Draft: G Minor (7 notes)');eq(flow.note(60),[144,67,91,128,67,27]);
flow.state.scaleselect(1);eq(flow.labels.follow_toggle,0);eq(flow.views.at(-1),['view',7,1453]);
// Custom menu selection must preserve a local draft even when Live's scale is named Custom.
flow=integration();flow.click(125);flow.click(100,10);
flow.state.livescale(0,'Custom',1,0,2,4,5,7,9,11);
flow.state.scaleselect(12);
eq(flow.views.at(-1),['view',0,2733]);eq(flow.note(64),[144,64,91,128,64,27]);flow.state.apply();eq(flow.note(64),[144,63,91,128,63,27]);
console.log(assertions+' state and keyboard/model/MIDI assertions passed');

// Current Scale must stay current even when blob restore precedes init.
const savedFollow=[2,1,0,'Major',2741,0,'Major',2741,1];
let reopening=load();reopening.livescale(2,'Dorian',1,...dorian);
reopening.setvalueof(...savedFollow);
eq(reopening.events.at(-1),[0,['configure',2,0,2,3,5,7,9,10]]);

// Six startup orderings observed only through public saved value/messages.
for(const order of ['ABI','AIB','BAI','BIA','IAB','IBA']){
    reopening=load();
    for(const step of order){
        if(step==='A')reopening.livescale(2,'Dorian',1,...dorian);
        if(step==='B')reopening.setvalueof(...savedFollow);
        if(step==='I')reopening.init();
    }
    eq(reopening.getvalueof(),[3,1,2,'Dorian',1709,2,'Dorian',1709,1,0]);
    eq(reopening.events.at(-1),[0,['configure',2,0,2,3,5,7,9,10]]);
}
// Literal version-2 fixtures preserve draft and sounding scale independently.
const savedCustoms=[
    [2,0,2,'Custom',2733,2,'Custom',2733,1],
    [2,0,4,'Custom',2725,2,'Dorian',1709,1],
    [2,0,7,'Custom',2749,0,'Major',2741,0]
];
for(const blob of savedCustoms){
    const original=integration();original.state.setvalueof(...blob);
    const roundtrip=Array.from(original.state.getvalueof());eq(roundtrip,[3,...blob.slice(1),0]);
    const reopened=integration();reopened.state.setvalueof(...roundtrip);reopened.state.init();
    eq(reopened.state.getvalueof(),[3,...blob.slice(1),0]);
    eq(reopened.views.at(-1),['view',blob[2],blob[4]]);
    eq(reopened.labels.black_menu,blob[8]);
    eq(reopened.note(60),[144,60+blob[5],91,128,60+blob[5],27]);
    if(blob[4]===2725){
        assert.match(reopened.labels.status_label,/^Playing: D Dorian \(7 notes\)$/);assertions++;
        reopened.state.toggle(8);eq(reopened.note(60),[144,62,91,128,62,27]);reopened.state.apply();eq(reopened.note(60),[144,64,91,128,64,27]);
    }
    if(blob[4]===2749){
        assert.match(reopened.labels.status_label,/^Playing: C Major \(7 notes\)$/);assertions++;
        reopened.state.toggle(11);eq(reopened.note(60),[144,60,91,128,60,27]);reopened.state.apply();eq(reopened.note(60),[144,67,91,128,67,27]);
    }
}
const deviceA=integration(),deviceB=integration();
deviceA.state.setvalueof(...savedCustoms[0]);deviceB.state.setvalueof(...savedCustoms[2]);
deviceA.state.rootselect(4);deviceA.state.blackselect(0);
eq(deviceB.state.getvalueof(),[3,...savedCustoms[2].slice(1),0]);eq(deviceB.note(60),[144,60,91,128,60,27]);
// A saved blob carries musical configuration, never held notes or audition tasks.
const sounding=integration();sounding.state.setvalueof(...savedCustoms[0]);
sounding.send(144,60,80);sounding.state.audition(2);
eq(sounding.scheduled.length,1);eq(sounding.state.getvalueof(),[3,...savedCustoms[0].slice(1),0]);
const silentReopen=integration();silentReopen.midiBytes.length=0;
silentReopen.state.setvalueof(...sounding.state.getvalueof());silentReopen.state.init();
eq(silentReopen.midiBytes,[]);eq(silentReopen.scheduled.length,0);
silentReopen.send(128,60,37);eq(silentReopen.midiBytes,[]);
eq(silentReopen.note(60),[144,62,91,128,62,27]);
console.log(assertions+' state, integration and restoration assertions passed');
// Follow and preferred/effective modes observed through public UI and MIDI messages.
flow=integration();
eq(flow.labels.mode_menu,1);
flow.state.livescale(0,'Octatonic',1,0,2,3,5,6,7,9,10);
eq(flow.note(72),[144,70,91,128,70,27]);
flow.state.modeselect(0);
assert.match(flow.labels.mode_status,/Continuous Degrees/);assertions++;
flow.state.livescale(0,'Major',1,0,2,4,5,7,9,11);
assert.match(flow.labels.mode_status,/Octave Anchored/);assertions++;
flow.click(125);const pendingView=flow.views.at(-1);
flow.state.modeselect(1);eq(flow.views.at(-1),pendingView);
eq(flow.note(64),[144,64,91,128,64,27]);
// Every supported length follows automatically, in both directions; literal fixtures.
const lengths=[
 [[0],48,72],[[0,1],49,61],[[0,1,2],50,61],[[0,1,2,3],51,61],
 [[0,1,2,3,4],52,61],[[0,1,2,3,4,5],53,61],[[0,1,2,3,4,5,6],54,61],
 [[0,1,2,3,4,5,6,7],55,61],[[0,1,2,3,4,5,6,7,8],56,61],
 [[0,1,2,3,4,5,6,7,8,9],57,61],[[0,1,2,3,4,5,6,7,8,9,10],58,61],
 [[0,1,2,3,4,5,6,7,8,9,10,11],59,61]
];
for(const [intervals,below,above] of lengths){
 flow=integration();flow.state.modeselect(0);flow.state.livescale(0,'Literal',1,...intervals);
 eq(flow.note(59),[144,below,91,128,below,27]);eq(flow.note(60),[144,60,91,128,60,27]);
 eq(flow.note(62),[144,above,91,128,above,27]);eq(flow.labels.mode_menu,0);
 assert.match(flow.labels.mode_status,intervals.length===7?/^Octave Anchored$/:/^Continuous Degrees: \d+ notes?; Anchored needs 7$/);assertions++;
 const saved=Array.from(flow.state.getvalueof()),again=integration();again.state.setvalueof(...saved);
 // Follow refreshes on reopen; disable it to test the independently saved sounding scale.
 saved[1]=0;again.state.setvalueof(...saved);eq(again.note(59),[144,below,91,128,below,27]);
}
flow=integration();flow.state.livescale(2,'Octatonic',1,0,2,3,5,6,7,9,10);
eq(flow.note(59),[144,60,91,128,60,27]);eq(flow.note(60),[144,62,91,128,62,27]);
console.log(assertions+' total state/integration assertions passed');
// Local Root and named Scale edits stage both parts until explicit Apply.
flow=integration();flow.state.rootselect(2);flow.state.scaleselect(1);
eq(flow.labels.scale_title,'Draft: D Minor (7 notes)');
eq(flow.labels.status_label,'Playing: C Major (7 notes)');
eq(flow.note(60),[144,60,91,128,60,27]);
flow.state.apply();eq(flow.labels.status_label,'Playing: D Minor (7 notes)');
eq(flow.note(64),[144,65,91,128,65,27]);
// Returning to unavailable Follow discards a local draft; toggling off cannot resurrect it.
flow=integration();flow.state.rootselect(2);flow.state.scaleselect(1);
flow.state.apistatus('Offline');flow.state.followselect(1);
eq(flow.labels.status_label,'Live unavailable');
flow.state.followselect(0);
eq(flow.labels.scale_title,'Draft: C Major (7 notes)');
eq(flow.note(64),[144,64,91,128,64,27]);
// Eight-note drafts do not alter the effective mode of a seven-note Sounding Scale.
flow=integration();flow.state.modeselect(0);flow.click(100,10);
eq(flow.labels.scale_title,'Draft: C Custom (8 notes)');
eq(flow.labels.mode_status,'Octave Anchored');
eq(flow.note(72),[144,72,91,128,72,27]);
flow.state.modeselect(1);eq(flow.note(72),[144,72,91,128,72,27]);
flow.state.modeselect(0);flow.state.apply();
eq(flow.labels.mode_status,'Continuous Degrees: 8 notes; Anchored needs 7');
eq(flow.note(72),[144,71,91,128,71,27]);
// Root transposition keeps the pending intervals; Root cannot be removed and clicks are silent.
flow=integration();flow.state.rootselect(2);flow.state.scaleselect(1);
flow.midiBytes.length=0;
flow.click(75); // physical D is this draft's Root
flow.state.scaleselect(12);eq(flow.views.at(-1),['view',2,1453]);
eq(flow.midiBytes,[]);eq(flow.note(60),[144,60,91,128,60,27]);
flow.state.rootselect(4);eq(flow.views.at(-1),['view',4,1453]);
eq(flow.note(60),[144,60,91,128,60,27]);
flow.state.apply();eq(flow.note(60),[144,64,91,128,64,27]);
// Live changes cannot overwrite pending edits; enabling Follow abandons them permanently.
flow=integration();flow.state.rootselect(2);flow.state.scaleselect(1);
flow.state.livescale(7,'Whole Tone',1,0,2,4,6,8,10);
eq(flow.labels.scale_title,'Draft: D Minor (7 notes)');
eq(flow.note(60),[144,60,91,128,60,27]);
flow.state.followselect(1);eq(flow.labels.scale_title,'Draft: G Whole Tone (6 notes)');
eq(flow.note(60),[144,67,91,128,67,27]);
flow.state.followselect(0);flow.state.scaleselect(12);
eq(flow.views.at(-1),['view',7,1365]);
eq(flow.note(60),[144,67,91,128,67,27]);
// Apply during a held note changes new note-ons, retaining the original release target/velocity.
flow=integration();flow.midiBytes.length=0;flow.send(144,64,101);
flow.click(125);flow.click(100,10);flow.state.apply();flow.send(128,64,39);
eq(flow.midiBytes,[144,64,101,128,64,39]);
eq(flow.note(64),[144,63,91,128,63,27]);
// One-note and twelve-note local gamuts are explicitly applied, never auto-promoted.
flow=integration();for(const pc of [2,4,5,7,9,11])flow.state.toggle(pc);
eq(flow.labels.scale_title,'Draft: C Custom (1 note)');
eq(flow.note(62),[144,62,91,128,62,27]);flow.state.apply();
eq(flow.note(62),[144,72,91,128,72,27]);
flow=integration();for(const pc of [1,3,6,8,10])flow.state.toggle(pc);
eq(flow.labels.scale_title,'Draft: C Custom (12 notes)');
eq(flow.note(72),[144,72,91,128,72,27]);flow.state.apply();
eq(flow.note(72),[144,67,91,128,67,27]);
console.log(assertions+' total state/integration/Apply assertions passed');
// A malformed saved membership must not silently become a different scale on reopen.
for(const badMask of [2741.5,6837,-1355,NaN,Infinity]){
 const device=integration(),before=Array.from(device.state.getvalueof());
 device.state.setvalueof(3,0,2,'Custom',badMask,0,'Major',2741,1,0);
 eq(device.state.getvalueof(),before);
 device.state.setvalueof(3,0,2,'Custom',1453,0,'Major',badMask,1,0);
 eq(device.state.getvalueof(),before);
}
// v2 migration visibly retains its pending draft until Apply, including all legacy lengths.
const legacy=[
 {blob:[2,0,2,'Custom',1453,0,'Major',2741,1],draft:'Draft: D Custom (7 notes)',before:72,after:74},
 {blob:[2,0,4,'Custom',1365,2,'Dorian',1709,0],draft:'Draft: E Custom (6 notes)',before:74,after:78},
 {blob:[2,0,7,'Custom',1773,0,'Major',2741,1],draft:'Draft: G Custom (8 notes)',before:72,after:77}
];
for(const fixture of legacy){
 const device=integration();device.state.setvalueof(...fixture.blob);device.state.init();
 eq(device.labels.scale_title,fixture.draft);eq(device.labels.mode_menu,0);
 eq(device.note(72),[144,fixture.before,91,128,fixture.before,27]);
 device.state.apply();eq(device.note(72),[144,fixture.after,91,128,fixture.after,27]);
}
// Literal new-version pending states retain both roots, mode preference and Black Keys.
const pendingStates=[
 {blob:[3,0,2,'Custom',661,7,'Minor',1453,1,1],title:'Draft: D Custom (5 notes)',after72:78,mode:'Continuous Degrees'},
 {blob:[3,0,4,'Custom',1773,2,'Dorian',1709,0,0],title:'Draft: E Custom (8 notes)',after72:74,mode:'Continuous Degrees: 8 notes; Anchored needs 7'},
 {blob:[3,0,7,'Custom',4095,0,'Major',2741,1,0],title:'Draft: G Custom (12 notes)',after72:74,mode:'Continuous Degrees: 12 notes; Anchored needs 7'}
];
for(const fixture of pendingStates){
 const source=integration();source.state.setvalueof(...fixture.blob);
 const saved=Array.from(source.state.getvalueof());eq(saved,fixture.blob);
 const device=integration();device.state.setvalueof(...saved);device.state.init();
 eq(device.state.getvalueof(),fixture.blob);eq(device.labels.scale_title,fixture.title);
 eq(device.labels.mode_menu,fixture.blob[9]);eq(device.labels.black_menu,fixture.blob[8]);
 eq(device.views.at(-1),['view',fixture.blob[2],fixture.blob[4]]);
 eq(device.note(60),[144,60+fixture.blob[5],91,128,60+fixture.blob[5],27]);
 device.state.apply();eq(device.labels.mode_status,fixture.mode);
 eq(device.note(72),[144,fixture.after72,91,128,fixture.after72,27]);
 const applied=integration();applied.state.setvalueof(...device.state.getvalueof());
 eq(applied.labels.mode_status,fixture.mode);eq(applied.note(72),[144,fixture.after72,91,128,fixture.after72,27]);
 if(fixture.blob[9]===0){
  applied.state.followselect(1);eq(applied.labels.mode_status,'Octave Anchored');eq(applied.labels.mode_menu,0);
 }
}
// Every startup ordering retains non-scale preferences while fresh Live replaces stale Follow.
for(const order of ['ABI','AIB','BAI','BIA','IAB','IBA']){
 for(const preferred of [0,1])for(const blackMode of [0,1]){
  const device=integration(),blob=[3,1,4,'Custom',1773,0,'Major',2741,blackMode,preferred];
  for(const step of order){
   if(step==='A')device.state.livescale(2,'Octatonic',1,0,2,3,5,6,7,9,10);
   if(step==='B')device.state.setvalueof(...blob);
   if(step==='I')device.state.init();
  }
  eq(device.state.getvalueof(),[3,1,2,'Octatonic',1773,2,'Octatonic',1773,blackMode,preferred]);
  eq(device.labels.scale_title,'Draft: D Octatonic (8 notes)');
  eq(device.labels.status_label,'Playing: D Octatonic (8 notes)');
  eq(device.labels.mode_menu,preferred);eq(device.labels.black_menu,blackMode);
  eq(device.note(72),[144,72,91,128,72,27]);
  device.state.livescale(2,'Dorian',1,0,2,3,5,7,9,10);
  eq(device.labels.mode_status,preferred===0?'Octave Anchored':'Continuous Degrees');
 }
}
// A separate instance cannot receive the other's Apply, stored preferences or MIDI releases.
const independentA=integration(),independentB=integration();
independentA.state.setvalueof(...pendingStates[0].blob);independentB.state.setvalueof(...pendingStates[1].blob);
independentA.state.apply();independentA.state.modeselect(0);independentA.send(144,60,88);
eq(independentB.state.getvalueof(),pendingStates[1].blob);
independentB.midiBytes.length=0;independentB.send(128,60,43);eq(independentB.midiBytes,[]);
eq(independentB.labels.scale_title,'Draft: E Custom (8 notes)');
console.log(assertions+' total state/integration/migration assertions passed');
// Rendered note highlights and audition timers are session-only, even with a pending blob.
const litSource=integration();litSource.state.setvalueof(...pendingStates[0].blob);
litSource.send(144,60,90);litSource.state.audition(3);
eq(litSource.paint(),2);eq(litSource.scheduled.length,1);
const litReopen=integration();litReopen.midiBytes.length=0;
litReopen.state.setvalueof(...litSource.state.getvalueof());litReopen.state.init();
eq(litReopen.paint(),0);eq(litReopen.scheduled.length,0);eq(litReopen.midiBytes,[]);
litReopen.send(128,60,32);eq(litReopen.paint(),0);eq(litReopen.midiBytes,[]);
litSource.scheduled[0]();eq(litReopen.paint(),0);eq(litReopen.midiBytes,[]);
console.log(assertions+' final state/integration/migration assertions passed');
