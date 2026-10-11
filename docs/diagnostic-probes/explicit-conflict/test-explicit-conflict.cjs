const fs=require('fs'),vm=require('vm'),assert=require('assert');
const shared={};
function device(saved,id,anchorId=99){
 const events=[],ui={},tasks=[],midiBytes=[];
 const midi={arrayfromargs:a=>Array.from(a),outlet:(i,...a)=>{if(i===0)midiBytes.push(...a)},Task:function(){this.cancel=()=>{};this.schedule=()=>{}}};
 vm.createContext(midi);vm.runInContext(fs.readFileSync(__dirname+'/probe-midi.js','utf8'),midi);
 const c={Global:function(){return shared},Task:function(f){this.repeat=()=>tasks.push(f);this.cancel=()=>{}},LiveAPI:function(cb,path){this.id=path==='live_set'?90:path==='this_device'?id:path==='live_set master_track mixer_device volume'?99:Number(String(path).replace('id ',''));this.get=()=>['Device '+this.id]},arrayfromargs:a=>Array.from(a),notifyclients:()=>events.push('saved'),outlet:(i,cmd,...a)=>{if(i===1)midi[cmd](...a)},patcher:{getnamed:n=>({message:(...a)=>{ui[n]=a;if(n==='song_anchor'&&a[0]==='getid')c.anchor_set('id',anchorId)}})}};
 vm.createContext(c);vm.runInContext(fs.readFileSync(__dirname+'/explicit-conflict.js','utf8'),c);
 if(saved)c.setvalueof(...saved);c.init();return {c,ui,events,id,midiBytes,note:(n)=>{midiBytes.length=0;[144,n,100,128,n,20].forEach(x=>midi.msg_int(x));return midiBytes.slice()},saved:()=>JSON.parse(JSON.stringify(c.getvalueof()))};
}
const saved=[1,'original',1,'',0,2741];
const copy=device(saved,12),original=device(saved,11);copy.c.tick();original.c.tick();
assert.equal(copy.saved()[1],'original');assert.equal(original.saved()[1],'original');
assert.match(String(copy.ui.connection),/Identity conflict/);assert.match(String(original.ui.connection),/Identity conflict/);

// A keeper choice preserves the selected Host, re-identifies the other device,
// and both saved records reopen without another ownership question.
original.c.choose(2);copy.c.tick();original.c.tick();
assert.equal(original.saved()[1],'original');assert.equal(original.saved()[2],1);
assert.notEqual(copy.saved()[1],'original');assert.equal(copy.saved()[2],0);
const originalSave=original.saved(),copySave=copy.saved();
original.c.notifydeleted();copy.c.notifydeleted();
const restoredCopy=device(copySave,32),restoredOriginal=device(originalSave,31);
restoredCopy.c.tick();restoredOriginal.c.tick();
assert.deepEqual(restoredOriginal.saved(),originalSave);assert.deepEqual(restoredCopy.saved(),copySave);
assert.doesNotMatch(String(restoredOriginal.ui.connection),/conflict/);
// The test seam must expose actual MIDI messages, not a displayed scale only.
const midiEvents=[];const midi={arrayfromargs:a=>Array.from(a),outlet:(i,...a)=>{if(i===0)midiEvents.push(...a)},Task:function(){this.cancel=()=>{};this.schedule=()=>{}}};
vm.createContext(midi);vm.runInContext(fs.readFileSync(__dirname+'/probe-midi.js','utf8'),midi);
midi.configure(2,1709);[144,60,100,128,60,20].forEach(n=>midi.msg_int(n));
assert.deepEqual(midiEvents,[144,62,100,128,62,20]);

// Model -> mapper -> real MIDI output: last Sounding Scale is held during conflict.
assert.deepEqual(restoredOriginal.note(60),[144,60,100,128,60,20]);
const follower=device([1,'follower',0,'original',5,1757],41);
follower.c.tick();assert.equal(follower.saved()[4],0);
restoredOriginal.c.rootselect(2);follower.c.tick();
assert.deepEqual(follower.note(60),[144,62,100,128,62,20]);
const unresolved=device(restoredOriginal.saved(),51);follower.c.tick();
unresolved.c.rootselect(7);follower.c.tick();
assert.deepEqual(follower.note(60),[144,62,100,128,62,20]);
assert.equal(follower.saved()[3],'original');
// Source loss keeps last scale and reference. Reappearance resumes automatically.
unresolved.c.notifydeleted();restoredOriginal.c.notifydeleted();follower.c.tick();
assert.deepEqual(follower.note(60),[144,62,100,128,62,20]);
const returned=device([1,'original',1,'',4,2741],61);follower.c.tick();
assert.deepEqual(follower.note(60),[144,64,100,128,64,20]);
// Unresolved round trip preserves both claims; reversed load order still conflicts.
const clone=device(returned.saved(),62),unsavedA=returned.saved(),unsavedB=clone.saved();
returned.c.notifydeleted();clone.c.notifydeleted();
const b=device(unsavedB,72),a=device(unsavedA,71);a.c.tick();b.c.tick();
assert.match(String(a.ui.connection),/Identity conflict/);assert.match(String(b.ui.connection),/Identity conflict/);
// A Follower keeper remains a Follower; three claims get unique IDs.
const fcopy=device(follower.saved(),42),fthird=device(follower.saved(),43);
follower.c.tick();fcopy.c.tick();fthird.c.tick();
follower.c.choose(1);fcopy.c.tick();fthird.c.tick();
assert.equal(follower.saved()[1],'follower');assert.equal(follower.saved()[2],0);assert.equal(follower.saved()[3],'original');
assert.equal(new Set([follower.saved()[1],fcopy.saved()[1],fthird.saved()[1]]).size,3);
const before=fcopy.saved();fcopy.c.choose(1);assert.deepEqual(fcopy.saved(),before);
// Removed candidate invalidates a pending selection rather than guessing another keeper.
a.c.tick();b.c.notifydeleted();a.c.choose(1);assert.equal(a.saved()[1],'original');
// Invalid persisted tuples leave all existing state intact.
const state=a.saved();for(const invalid of [[1,'x',1,'target',0,2741],[1,'x',0,'',12,2741],[1,'x',0,'',0,2],[1,'x',0,'',0,4096]]){a.c.setvalueof(...invalid);assert.deepEqual(a.saved(),state);}
console.log('Explicit conflict, restore, source loss, selection and model-to-MIDI tests passed. Native Live acceptance NOT RUN.');
// Once a conflict was observed, removing an alternative must not silently elect a keeper.
const late=device(a.saved(),81);a.c.tick();late.c.tick();late.c.notifydeleted();a.c.tick();
assert.match(String(a.ui.connection),/Identity conflict/);

// Native reference unresolved is a safe gate, never a raw runtime ownership test.
const foreign=device([1,'foreign',1,'',3,2741],91,0);
assert.match(String(foreign.ui.connection),/reference unresolved/);
assert.equal(foreign.saved()[1],'foreign');assert.equal(foreign.saved()[2],1);
foreign.c.host(1);assert.match(String(foreign.ui.connection),/sharing blocked/);
// A follower waiting for readiness does not generate a conflict or lose last scale.
const waiting=device([1,'waiting',0,'not-yet-ready',6,1709],92);
assert.match(String(waiting.ui.connection),/Source unavailable/);
assert.deepEqual(waiting.note(60),[144,66,100,128,66,20]);
// Selection captured for a two-device group cannot resolve a later third claimant.
const third=device(a.saved(),82);a.c.tick();const fourth=device(a.saved(),83);
a.c.choose(1);assert.equal(a.saved()[1],'original');assert.match(a.c.notice,/expired/);
console.log('Native-gate test doubles passed; real mapping and lifecycle still NOT RUN.');
