// Approved UI/message seam: native panel routes into real state and MIDI scripts.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const patch=JSON.parse(fs.readFileSync(__dirname+'/WhiteKeys Live 12.maxpat')).patcher;
const boxes=Object.fromEntries(patch.boxes.map(x=>[x.box.id,x.box]));
const ui={},bytes=[];
const midi={arrayfromargs:a=>Array.from(a),outlet:(i,...a)=>{if(i===0)bytes.push(...a)},Task:function(){this.schedule=()=>{};this.cancel=()=>{}}};
vm.createContext(midi);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-midi.js','utf8'),midi);
const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{if(a[0]==='set')ui[n]=a[1]}})},outlet:(i,...a)=>{if(i!==0)return;if(Array.isArray(a[0]))a=Array.from(a[0]);midi[a[0]](...a.slice(1))}};
vm.createContext(state);vm.runInContext(fs.readFileSync(__dirname+'/whitekeys-state.js','utf8'),state);
function select(control,index){const route=patch.lines.find(x=>x.patchline.source[0]===control).patchline.destination[0];const command=boxes[route].text.replace('prepend ','');state[command](index)}
function note(){bytes.length=0;midi.note(144,60,90);midi.note(128,60,23);return bytes.slice()}
state.livescale(2,'Dorian',1,0,2,3,5,7,9,10);
select('source',0);select('root',7);assert.deepStrictEqual(note(),[144,67,90,128,67,23]);assert.strictEqual(ui.source_menu,0);
select('source',1);select('root',0);assert.deepStrictEqual(note(),[144,62,90,128,62,23]);assert.strictEqual(ui.source_menu,1);
state.apistatus('Offline');assert.strictEqual(ui.source_status,'Live unavailable');assert.match(ui.status_label,/Playing: D Dorian/);assert.deepStrictEqual(note(),[144,62,90,128,62,23]);
select('source',2);assert.strictEqual(state.getvalueof()[3],'WhiteKeys');assert.strictEqual(ui.source_menu,2);assert.strictEqual(ui.source_status,'Select a Host');
select('host',1);assert.strictEqual(state.getvalueof()[4],0);select('source',1);select('host',1);assert.strictEqual(state.getvalueof()[4],1);assert.strictEqual(ui.host_toggle,1);
state.livescale(2,'A deliberately long external scale name that would overflow the panel',1,0,2,3,5,7,9,10);assert.ok(ui.status_label.length<=60);assert.match(ui.status_label,/Playing: D/);
console.log('Scale Source panel routing, Local/Live MIDI, Host/WhiteKeys transitions and retained Playing passed');
