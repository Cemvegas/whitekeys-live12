const fs=require('fs'),vm=require('vm'),assert=require('assert');let assertions=0;
function load(){let events=[],ui={};const c={arrayfromargs:a=>Array.from(a),outlet:(i,...a)=>events.push([i,...a]),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>ui[n]=a})}};vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),c);c.events=events;c.uiMessages=ui;return c}
function eq(a,b){assert.deepStrictEqual(JSON.parse(JSON.stringify(a)),b);assertions++}
const minor=[0,2,3,5,7,8,10],dorian=[0,2,3,5,7,9,10];let c=load();c.livescale(0,'Minor',1,...minor);eq(c.getvalueof()[1],1);c.toggle(3);eq(c.follow,0);eq(c.draft,[0,2,5,7,8,10]);eq(c.active,minor);c.toggle(4);eq(c.active,[0,2,4,5,7,8,10]);c.livescale(2,'Dorian',1,...dorian);eq(c.root,0);eq(c.activeRoot,0);c.followselect(1);eq(c.root,2);eq(c.draft,dorian);c.rootselect(4);eq(c.follow,0);eq(c.activeRoot,4);eq(c.active,dorian);c.toggle(4);eq(c.draft,dorian);c.toggle(6);eq(c.draft.length,6);eq(c.active,dorian);c.rootselect(7);eq(c.root,7);eq(c.activeRoot,4);c.toggle(9);eq(c.draft.length,7);eq(c.activeRoot,7);
let restored=load();restored.setvalueof(...c.getvalueof());eq(restored.getvalueof(),Array.from(c.getvalueof()));restored.livescale(0,'Minor',1,...minor);eq(restored.root,7);eq(restored.follow,0);c=load();c.scaleselect(1);eq(c.draft,minor);eq(c.follow,0);c.toggle(4);eq(c.draft.length,8);eq(c.active,minor);c.toggle(3);eq(c.active,[0,2,4,5,7,8,10]);c.blackselect(1);eq(c.black,1);restored=load();restored.setvalueof(...c.getvalueof());eq(restored.black,1);eq(restored.active,Array.from(c.active));c=load();c.livescale(0,'Major Pentatonic',1,0,2,4,7,9);eq(c.draft.length,5);eq(c.events.some(e=>JSON.stringify(e).includes('unavailable')),false);c.toggle(5);eq(c.draft.length,6);c.toggle(11);eq(c.active,[0,2,4,5,7,9,11]);console.log(assertions+' scale-editor assertions passed');

// The approved message seam: real Scale Keyboard -> state -> MIDI scripts.
// Host facilities (drawing, patcher UI and MIDI outlets) are boundary adapters.
function integration() {
    const midiBytes=[],labels={},views=[],scheduled=[];
    const midi={Task:function(callback){this.schedule=()=>scheduled.push(callback);this.cancel=()=>{}},arrayfromargs:a=>Array.from(a),outlet:(port,...a)=>{if(port===0)midiBytes.push(...a)}};
    vm.createContext(midi);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-midi.js','utf8'),midi);
    let keyboard;
    const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{if(a[0]==='set')labels[n]=a[1]}})},outlet:(port,...a)=>{
        if(Array.isArray(a[0]))a=Array.from(a[0]);
        if(port===0)midi[a[0]](...a.slice(1));
        else {views.push(a);keyboard[a[0]](...a.slice(1));}
    }};
    vm.createContext(state);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),state);
    keyboard={box:{rect:[0,0,350,70]},mgraphics:{init:()=>{},redraw:()=>{}},outlet:(port,command,pc)=>state[command](pc)};
    vm.createContext(keyboard);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-keyboard.js','utf8'),keyboard);
    state.livescale(0,'Major',1,0,2,4,5,7,9,11);
    return {state,labels,views,scheduled,midiBytes,send:(s,n,v)=>midi.note(s,n,v),click:(x,y=69)=>keyboard.onclick(x,y,1,0,0,0,0,0),note:(n)=>{midiBytes.length=0;midi.note(144,n,91);midi.note(128,n,27);return midiBytes.slice()}};
}
let flow=integration();flow.click(125); // E white key: 7 -> 6
assert.match(flow.labels.status_label,/6 notes - playing C Major/);assertions++;
eq(flow.views.at(-1),['view',0,2725]);eq(flow.note(64),[144,64,91,128,64,27]);
flow.click(100,10); // Eb black key: 6 -> 7
assert.match(flow.labels.status_label,/7 notes/);assertions++;
eq(flow.labels.follow_toggle,0);eq(flow.labels.scale_title,'C Custom');eq(flow.note(64),[144,63,91,128,63,27]);
flow=integration();flow.click(100,10); // 7 -> 8
assert.match(flow.labels.status_label,/8 notes - playing C Major/);assertions++;
eq(flow.views.at(-1),['view',0,2749]);eq(flow.note(64),[144,64,91,128,64,27]);
flow.click(125);eq(flow.note(64),[144,63,91,128,63,27]);
const beforeRoot=flow.views.at(-1);flow.click(25);eq(flow.views.at(-1),beforeRoot);
flow.state.rootselect(2);eq(flow.views.at(-1),['view',2,2733]);eq(flow.note(60),[144,62,91,128,62,27]);
flow.click(175); // F is third degree at D: invalid draft, sounding root remains D
flow.state.rootselect(4);assert.match(flow.labels.status_label,/6 notes - playing D Custom/);assertions++;
eq(flow.note(60),[144,62,91,128,62,27]);
flow.click(225); // G restores missing third relative to E
eq(flow.note(60),[144,64,91,128,64,27]);
flow.state.livescale(7,'Minor',1,0,2,3,5,7,8,10);
eq(flow.note(60),[144,64,91,128,64,27]);
flow.state.followselect(1);eq(flow.labels.scale_title,'G Minor');eq(flow.note(60),[144,67,91,128,67,27]);
flow.state.scaleselect(1);eq(flow.labels.follow_toggle,0);eq(flow.views.at(-1),['view',7,1453]);
// Custom menu selection must preserve a local draft even when Live's scale is named Custom.
flow=integration();flow.click(125);flow.click(100,10);
flow.state.livescale(0,'Custom',1,0,2,4,5,7,9,11);
flow.state.scaleselect(12);
eq(flow.views.at(-1),['view',0,2733]);eq(flow.note(64),[144,63,91,128,63,27]);
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
        assert.match(reopened.labels.status_label,/6 notes - playing D Dorian/);assertions++;
        reopened.state.toggle(8);eq(reopened.note(60),[144,64,91,128,64,27]);
    }
    if(blob[4]===2749){
        assert.match(reopened.labels.status_label,/8 notes - playing C Major/);assertions++;
        reopened.state.toggle(11);eq(reopened.note(60),[144,67,91,128,67,27]);
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
assert.match(flow.labels.status_label,/Continuous Degrees.*8 notes/);assertions++;
flow.state.livescale(0,'Major',1,0,2,4,5,7,9,11);
assert.match(flow.labels.status_label,/Octave Anchored/);assertions++;
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
 assert.match(flow.labels.mode_status,intervals.length===7?/^Octave Anchored$/:/^Continuous Degrees \(automatic\)$/);assertions++;
 const saved=Array.from(flow.state.getvalueof()),again=integration();again.state.setvalueof(...saved);
 // Follow refreshes on reopen; disable it to test the independently saved sounding scale.
 saved[1]=0;again.state.setvalueof(...saved);eq(again.note(59),[144,below,91,128,below,27]);
}
flow=integration();flow.state.livescale(2,'Octatonic',1,0,2,3,5,6,7,9,10);
eq(flow.note(59),[144,60,91,128,60,27]);eq(flow.note(60),[144,62,91,128,62,27]);
console.log(assertions+' total state/integration assertions passed');
