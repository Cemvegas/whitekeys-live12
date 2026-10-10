const fs=require('fs'),vm=require('vm'),assert=require('assert');let assertions=0;
function load(){let events=[],ui={};const c={arrayfromargs:a=>Array.from(a),outlet:(i,...a)=>events.push([i,...a]),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>ui[n]=a})}};vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),c);c.events=events;c.uiMessages=ui;return c}
function eq(a,b){assert.deepStrictEqual(JSON.parse(JSON.stringify(a)),b);assertions++}
// The approved message seam: real Scale Keyboard -> state -> MIDI scripts.
// Host facilities (drawing, patcher UI and MIDI outlets) are boundary adapters.
function integration() {
    const midiBytes=[],labels={},menus={},views=[],scheduled=[],paintColors=[];
    let keyboard;
    const midi={Task:function(callback){this.schedule=()=>scheduled.push(callback);this.cancel=()=>{}},arrayfromargs:a=>Array.from(a),outlet:(port,...a)=>{if(port===0)midiBytes.push(...a);else{if(Array.isArray(a[0]))a=Array.from(a[0]);keyboard[a[0]](...a.slice(1));}}};
    vm.createContext(midi);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-midi.js','utf8'),midi);
    const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{if(a[0]==='set')labels[n]=a[1];if(a[0]==='clear')menus[n]=[];if(a[0]==='append')(menus[n]||(menus[n]=[])).push(a[1])}})},outlet:(port,...a)=>{
        if(Array.isArray(a[0]))a=Array.from(a[0]);
        if(port===0)midi[a[0]](...a.slice(1));
        else {views.push(a);keyboard[a[0]](...a.slice(1));}
    }};
    vm.createContext(state);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),state);
    keyboard={box:{rect:[0,0,350,70]},mgraphics:{init:()=>{},redraw:()=>{},set_source_rgba:(...a)=>paintColors.push(a),rectangle_rounded:()=>{},fill:()=>{},set_line_width:()=>{},stroke:()=>{},rectangle:()=>{},select_font_face:()=>{},set_font_size:()=>{},text_measure:()=>[4],move_to:()=>{},show_text:()=>{}},outlet:(port,command,pc)=>state[command](pc)};
    vm.createContext(keyboard);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-keyboard.js','utf8'),keyboard);
    state.livescale(0,'Major',1,0,2,4,5,7,9,11);
    return {state,labels,menus,views,scheduled,midiBytes,paint:()=>{paintColors.length=0;keyboard.paint();return paintColors.filter(c=>c[0]===0.97&&c[1]===0.76&&c[2]===0.41).length},send:(s,n,v)=>midi.note(s,n,v),click:(x,y=69)=>keyboard.onclick(x,y,1,0,0,0,0,0),note:(n)=>{midiBytes.length=0;midi.note(144,n,91);midi.note(128,n,27);return midiBytes.slice()}};
}
// Local editing is immediate; source-controlled editing is read-only.
let flow=integration();flow.state.followselect(0);flow.click(125);flow.click(100,10);
eq(flow.note(64),[144,63,91,128,63,27]);
// Legacy pending edits are discarded; only the saved Sounding Scale migrates.
flow=integration();flow.state.setvalueof(3,0,4,'Custom',4095,2,'Dorian',1709,1,0);
eq(flow.note(60),[144,62,91,128,62,27]);eq(flow.views.at(-1),['view',2,1709]);
const saved=Array.from(flow.state.getvalueof());eq(saved[0],4);eq(saved.slice(3),['Local',0,'','','',2,1709,'Dorian',1]);
const reopen=integration();reopen.state.setvalueof(...saved);eq(reopen.state.getvalueof(),saved);
// Following sources reject all local edits and keep the current MIDI configuration.
flow=integration();const following=Array.from(flow.state.getvalueof());flow.state.rootselect(7);flow.state.scaleselect(1);flow.state.toggle(4);
eq(flow.state.getvalueof(),following);eq(flow.note(64),[144,64,91,128,64,27]);
flow.state.apistatus('Offline');eq(flow.note(64),[144,64,91,128,64,27]);assert.match(flow.labels.status_label,/Playing: C Major.*Live unavailable/);assertions++;
flow.state.followselect(0);flow.state.rootselect(2);flow.state.scaleselect(1);
eq(flow.note(60),[144,62,91,128,62,27]);eq(flow.note(64),[144,65,91,128,65,27]);
const rootBefore=Array.from(flow.state.getvalueof());flow.state.toggle(2);eq(flow.state.getvalueof(),rootBefore);
// Held note releases retain their original target and channel after immediate edits.
flow=integration();flow.state.followselect(0);flow.midiBytes.length=0;flow.send(147,64,101);flow.click(125);flow.click(100,10);flow.send(131,64,39);
eq(flow.midiBytes,[147,64,101,131,64,39]);eq(flow.note(64),[144,63,91,128,63,27]);
// All legacy mode preferences produce identical Sounding Scale migration.
for(const version of [2,3])for(const preference of [0,1]){
 const blob=[version,0,7,'Custom',4095,2,'Dorian',1709,1];if(version===3)blob.push(preference);
 const device=integration();device.state.setvalueof(...blob);eq(device.views.at(-1),['view',2,1709]);eq(device.note(60),[144,62,91,128,62,27]);eq(device.labels.black_menu,1);
}
// Six API/blob/init orderings refresh a stale Follow record, never its legacy draft.
for(const order of ['ABI','AIB','BAI','BIA','IAB','IBA']){
 const device=load();
 for(const step of order){if(step==='A')device.livescale(2,'Dorian',1,0,2,3,5,7,9,10);if(step==='B')device.setvalueof(3,1,7,'Custom',4095,0,'Major',2741,1,0);if(step==='I')device.init();}
 eq(device.getvalueof().slice(8),[2,1709,'Dorian',1]);eq(device.events.at(-1),[0,['configure',2,0,2,3,5,7,9,10]]);
}
// Literal continuous-degree fixtures include downward wrapping for all 1–12 lengths.
const lengths=[[[0],48,72],[[0,1],49,61],[[0,1,2],50,61],[[0,1,2,3],51,61],[[0,1,2,3,4],52,61],[[0,1,2,3,4,5],53,61],[[0,1,2,3,4,5,6],54,61],[[0,1,2,3,4,5,6,7],55,61],[[0,1,2,3,4,5,6,7,8],56,61],[[0,1,2,3,4,5,6,7,8,9],57,61],[[0,1,2,3,4,5,6,7,8,9,10],58,61],[[0,1,2,3,4,5,6,7,8,9,10,11],59,61]];
for(const [intervals,below,above] of lengths){const device=integration();device.state.livescale(0,'Literal',1,...intervals);eq(device.note(59),[144,below,91,128,below,27]);eq(device.note(62),[144,above,91,128,above,27]);}
// v4 restore validation is atomic for schema, mask, root and source contradictions.
for(const [index,value] of [[0,5],[1,''],[2,''],[3,'Other'],[4,2],[5,'unexpected'],[6,'unexpected'],[7,12],[8,12],[8,2.5],[9,0],[9,4096],[9,2741.5],[9,2740],[10,12],[11,2]]){
 const device=integration(),before=Array.from(device.state.getvalueof()),bad=before.slice();bad[index]=value;device.state.setvalueof(...bad);eq(device.state.getvalueof(),before);
}
for(const badMask of [2741.5,6837,-1355,NaN,Infinity])for(const index of [4,7]){const device=integration(),before=Array.from(device.state.getvalueof()),bad=[3,0,2,'Custom',1453,0,'Major',2741,1,0];bad[index]=badMask;device.state.setvalueof(...bad);eq(device.state.getvalueof(),before);}
// Saved configuration never persists note highlights or audition timers.
flow=integration();flow.send(144,60,90);flow.state.audition(3);eq(flow.paint(),2);
const clean=integration();clean.midiBytes.length=0;clean.state.setvalueof(...flow.state.getvalueof());clean.state.init();eq(clean.paint(),0);eq(clean.scheduled.length,0);eq(clean.midiBytes,[]);clean.send(128,60,32);eq(clean.midiBytes,[]);
console.log(assertions+' immediate editor/state/MIDI/migration assertions passed');
// Local membership extremes take effect without an Apply message.
flow=integration();flow.state.followselect(0);for(const pc of [2,4,5,7,9,11])flow.state.toggle(pc);eq(flow.note(62),[144,72,91,128,72,27]);eq(flow.state.getvalueof()[9],1);
flow=integration();flow.state.followselect(0);for(const pc of [1,3,6,8,10])flow.state.toggle(pc);eq(flow.note(72),[144,67,91,128,67,27]);eq(flow.state.getvalueof()[9],4095);
// A persisted but currently unsupported WhiteKeys source cannot be edited locally.
flow=integration();const unavailable=Array.from(flow.state.getvalueof());unavailable[3]='WhiteKeys';unavailable[5]='another-set';unavailable[6]='host-id';unavailable[7]='Piano';flow.state.setvalueof(...unavailable);flow.state.rootselect(7);flow.state.toggle(4);eq(flow.state.getvalueof(),unavailable);eq(flow.note(64),[144,64,91,128,64,27]);assert.match(flow.labels.status_label,/Source unavailable/);assertions++;
console.log(assertions+' final editor/state assertions passed');

// Adding the removed E recognizes C Major again, without moving Root.
flow=integration();flow.state.followselect(0);flow.state.toggle(4);eq(flow.state.getvalueof().slice(8,11),[0,2725,'Custom']);flow.state.toggle(4);eq(flow.state.getvalueof().slice(8,11),[0,2741,'Major']);

// Choosing A Minor from Also matches preserves C Major's absolute notes.
flow=integration();flow.state.followselect(0);
eq(flow.menus.scale_menu.slice(13),['Also matches','D Dorian','E Phrygian','F Lydian','G Mixolydian','A Minor','B Locrian']);
const alternative=flow.menus.scale_menu.indexOf('A Minor');flow.midiBytes.length=0;flow.send(146,60,98);flow.state.scaleselect(alternative);flow.send(130,60,35);
eq(flow.state.getvalueof().slice(8,11),[9,1453,'Minor']);eq(flow.views.at(-1),['view',9,1453]);eq(flow.midiBytes,[146,60,98,130,60,35]);eq(flow.note(60),[144,69,91,128,69,27]);
// Unknown Live names survive source updates, but Local adopts catalog recognition.
flow=integration();flow.state.livescale(2,'Live Special',1,0,2,3,5,7,9,10);eq(flow.labels.scale_title,'Scale: D Live Special (7 notes)');flow.state.followselect(0);eq(flow.state.getvalueof().slice(8,11),[2,1709,'Dorian']);
// Legacy Local labels are reidentified from the saved sounding membership, not draft.
flow=integration();flow.state.setvalueof(3,0,9,'Minor',1453,0,'Old Label',2741,0,1);eq(flow.state.getvalueof().slice(8,11),[0,2741,'Major']);
// Worked catalog fixtures through source->Local recognition at every Root.
const catalogFixtures=[['Major',[0,2,4,5,7,9,11]],['Minor',[0,2,3,5,7,8,10]],['Dorian',[0,2,3,5,7,9,10]],['Mixolydian',[0,2,4,5,7,9,10]],['Lydian',[0,2,4,6,7,9,11]],['Phrygian',[0,1,3,5,7,8,10]],['Locrian',[0,1,3,5,6,8,10]],['Harmonic Minor',[0,2,3,5,7,8,11]],['Melodic Minor',[0,2,3,5,7,9,11]],['Major Pentatonic',[0,2,4,7,9]],['Minor Pentatonic',[0,3,5,7,10]],['Whole Tone',[0,2,4,6,8,10]]];
for(const [catalogName,intervals] of catalogFixtures)for(let root=0;root<12;root++){
 const device=integration();device.state.livescale(root,'Unknown source label',1,...intervals);device.state.followselect(0);
 eq(device.state.getvalueof()[10],catalogName);eq(device.labels.root_menu,root);eq(device.note(60),[144,60+root,91,128,60+root,27]);
}
// A genuinely unmatched twelve-note scale remains Custom, without guessing a Root.
flow=integration();flow.state.livescale(7,'Chromatic from source',1,0,1,2,3,4,5,6,7,8,9,10,11);flow.state.followselect(0);eq(flow.state.getvalueof().slice(8,11),[7,4095,'Custom']);eq(flow.menus.scale_menu.length,13);
// Section headings cannot mutate the scale. Following rejects even alternate selection.
flow=integration();flow.state.followselect(0);const beforeHeading=Array.from(flow.state.getvalueof());flow.state.scaleselect(flow.menus.scale_menu.indexOf('Also matches'));eq(flow.state.getvalueof(),beforeHeading);
flow.state.followselect(1);const beforeFollowingAlternative=Array.from(flow.state.getvalueof());flow.state.scaleselect(flow.menus.scale_menu.indexOf('A Minor'));eq(flow.state.getvalueof(),beforeFollowingAlternative);
// Normal Root selection transposes rather than preserving absolute pitch classes.
flow=integration();flow.state.followselect(0);flow.state.rootselect(2);eq(flow.views.at(-1),['view',2,2741]);eq(flow.state.getvalueof()[10],'Major');
console.log(assertions+' scale recognition/editor/state/MIDI assertions passed');
