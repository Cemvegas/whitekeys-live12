const assert=require('assert');
const {make,run,menuItems,last,record,reset,devices,remove,reorder}=require('./sharing-test-fixture.cjs');
reset();const original=make(1600,record('automatic-host',0,2)),follower=make(1601,record('automatic-follow',0));original.transport.init();follower.transport.init();run();original.state.hostselect(1);run();follower.state.sourceselect(2);run();const copy=make(1602,Array.from(original.state.getvalueof()));copy.transport.init();run(15);
assert.equal(original.state.getvalueof()[1],'automatic-host');assert.equal(original.state.getvalueof()[4],1);assert.notEqual(copy.state.getvalueof()[1],'automatic-host');assert.equal(copy.state.getvalueof()[4],0);assert.match(last(follower.ui,'source_status'),/Following/);assert.equal(menuItems(original).length,0);assert.deepEqual(follower.note(),[144,62,90,128,62,23]);
console.log('Live Host duplication automatically preserves incumbent and reconnects without a chooser passed');
// Cold collisions always keep the first native Set device, never the first initializer.
for(const order of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]){
 reset();const copies=[make(202,record('cold-copy',1,2)),make(101,record('cold-copy',1,7)),make(300,record('cold-copy',1,9))],follow=make(400,[4,'cold-follow','set-A','WhiteKeys',0,'set-A','cold-copy','Piano',0,2741,'Major',1]);follow.transport.init();
 for(const i of order){copies[i].transport.init();follow.transport.tick();if(i!==order.at(-1))assert.deepEqual(follow.note(),[144,60,90,128,60,23]);}run(15);
 assert.equal(copies[0].state.getvalueof()[1],'cold-copy');assert.equal(copies[0].state.getvalueof()[4],1);assert.equal(copies[1].state.getvalueof()[4],0);assert.equal(copies[2].state.getvalueof()[4],0);assert.equal(new Set(copies.map(d=>d.state.getvalueof()[1])).size,3);assert.deepEqual(follow.note(),[144,62,90,128,62,23]);assert.equal(follow.state.getvalueof()[11],1);for(const d of devices)assert.equal(menuItems(d).length,0);
 const blobs=copies.map(d=>d.saved()),followBlob=follow.saved();
 assert.deepEqual(blobs,copies.map(d=>Array.from(d.state.getvalueof())));
 assert.equal(followBlob[6],'cold-copy');assert.equal(followBlob[11],1);
 reset();const re=blobs.map((b,i)=>make(500+i,b)),rf=make(503,followBlob);rf.transport.init();for(const i of order.slice().reverse())re[i].transport.init();run(15);assert.deepEqual(rf.note(),[144,62,90,128,62,23]);assert.equal(rf.state.getvalueof()[6],'cold-copy');
}
console.log('Three-copy cold resolution in all six initialization orders and saved reopen passed');

// Moving the new copy before its incumbent does not turn native order into live ownership.
reset();const incumbent=make(700,record('moved-copy',1,7)),incumbentFollow=make(701,[4,'moved-follow','set-A','WhiteKeys',0,'set-A','moved-copy','Piano',0,2741,'Major',0]);incumbent.transport.init();incumbentFollow.transport.init();run();const moved=make(702,Array.from(incumbent.state.getvalueof()));reorder([702,701,700]);moved.transport.init();run(15);assert.equal(incumbent.state.getvalueof()[1],'moved-copy');assert.notEqual(moved.state.getvalueof()[1],'moved-copy');assert.equal(incumbent.state.getvalueof()[4],1);assert.deepEqual(incumbentFollow.note(),[144,67,90,128,67,23]);
console.log('Live incumbent survives copy-first native position passed');
// Follower copies retain source and local preferences, while held notes release correctly.
reset();const source=make(800,record('auto-source',1,7)),f1=make(801,[4,'copy-follow','set-A','WhiteKeys',0,'set-A','auto-source','Piano',2,2741,'Major',1]);source.transport.init();f1.transport.init();run();f1.bytes.length=0;f1.midi.note(147,60,101);const f2=make(802,Array.from(f1.state.getvalueof()));f2.transport.init();run(15);f1.midi.note(131,60,39);assert.deepEqual(f1.bytes,[147,67,101,131,67,39]);assert.equal(f1.state.getvalueof()[1],'copy-follow');assert.notEqual(f2.state.getvalueof()[1],'copy-follow');assert.equal(f2.state.getvalueof()[6],'auto-source');assert.equal(f2.state.getvalueof()[11],1);assert.deepEqual(f2.note(),[144,67,90,128,67,23]);
console.log('Follower duplication retains source/Black Keys and held-channel MIDI passed');
// A removed participant retries automatically with the surviving native group.
reset();const survivor=make(900,record('removed-auto',1,2)),gone=make(901,record('removed-auto',1,7));survivor.transport.init();gone.transport.init();survivor.transport.tick();remove(901);run(15);assert.equal(survivor.state.getvalueof()[1],'removed-auto');assert.equal(survivor.state.getvalueof()[4],1);assert.equal(survivor.state.getvalueof()[12],undefined);assert.equal(menuItems(survivor).length,0);
console.log('Removed participant retries automatic survivor resolution passed');
// Invalid or not-yet-restored records cannot trigger identity allocation.
reset();const validOwner=make(1000,record('invalid-copy',1,2)),invalidCopy=make(1001,record('invalid-copy',1,7));invalidCopy.state.setvalueof(4,'broken');validOwner.transport.init();invalidCopy.transport.init();run(15);assert.equal(validOwner.state.getvalueof()[1],'invalid-copy');assert.equal(invalidCopy.state.getvalueof()[1],'invalid-copy');invalidCopy.state.setvalueof(...record('invalid-copy',1,7));run(15);assert.notEqual(invalidCopy.state.getvalueof()[1],'invalid-copy');assert.equal(validOwner.state.getvalueof()[4],1);
console.log('Invalid restore cannot cause partial automatic identity allocation passed');
// During automatic resolution, a different explicit Host cannot steal a blocked source reference.
reset();const blockedHost=make(1100,record('blocked-reference',1,2)),blockedFollow=make(1101,[4,'blocked-auto-follow','set-A','WhiteKeys',0,'set-A','blocked-reference','Piano',0,2741,'Major',0]),separate=make(1102,record('separate-active',0,9));for(const d of devices)d.transport.init();run();const blockedCopy=make(1103,Array.from(blockedHost.state.getvalueof()));blockedCopy.transport.init();blockedHost.transport.tick();blockedFollow.transport.tick();separate.state.hostselect(1);run(15);assert.equal(last(separate.ui,'host_toggle'),1);assert.equal(blockedFollow.state.getvalueof()[6],'blocked-reference');assert.deepEqual(blockedFollow.note(),[144,62,90,128,62,23]);assert.equal(blockedCopy.state.getvalueof()[4],0);separate.state.hostselect(1);run();assert.equal(blockedFollow.state.getvalueof()[6],'separate-active');assert.deepEqual(blockedFollow.note(),[144,69,90,128,69,23]);
console.log('Automatic resolution preserves blocked references until a later explicit handoff passed');
// Restore validity is rechecked throughout allocation, not only before the transaction.
reset();const inFlightA=make(1200,record('in-flight-invalid',1,2)),inFlightB=make(1201,record('in-flight-invalid',1,7));inFlightA.transport.init();inFlightB.transport.init();inFlightA.transport.tick();inFlightB.state.setvalueof(4,'broken');for(let poll=0;poll<15;poll++)for(const d of devices){d.transport.tick();assert.equal(inFlightB.state.getvalueof()[1],'in-flight-invalid');assert.equal(inFlightB.state.getvalueof()[4],1);}assert.equal(inFlightB.state.getvalueof()[1],'in-flight-invalid');assert.equal(inFlightB.state.getvalueof()[4],1);assert.equal(inFlightA.state.getvalueof()[12],1);inFlightB.state.setvalueof(...record('in-flight-invalid',1,7));run(15);assert.notEqual(inFlightB.state.getvalueof()[1],'in-flight-invalid');assert.equal(inFlightA.state.getvalueof()[12],undefined);
console.log('Invalid in-flight restore rolls back allocation and retries only after valid restore passed');

// Observe each scheduled device poll through saved state, UI and production MIDI.
reset();const stepHost=make(1300,record('step-host',1,2)),stepFollow=make(1301,[4,'step-follow','set-A','WhiteKeys',0,'set-A','step-host','Piano',0,2741,'Major',1]);
stepHost.transport.init();stepFollow.transport.init();run();
stepFollow.bytes.length=0;stepFollow.midi.note(147,60,101);
const stepCopy=make(1302,Array.from(stepHost.state.getvalueof()));stepCopy.transport.init();
for(let round=0;round<15;round++)for(const d of devices){
 d.transport.tick();
 assert.equal(stepHost.state.getvalueof()[1],'step-host');
 assert.equal(stepFollow.state.getvalueof()[6],'step-host');
 assert.equal(stepFollow.state.getvalueof()[11],1);
 // A blocked Follower keeps its last Sounding Scale, including mid-assignment.
 assert.deepEqual(stepCopy.note(),[144,62,90,128,62,23]);
 assert.deepEqual(stepFollow.note(),[144,62,90,128,62,23]);
 assert.ok(last(stepCopy.ui,'host_toggle')!==1);
 if(stepCopy.state.getvalueof()[1]!=='step-host')assert.equal(stepCopy.state.getvalueof()[4],0);
}
// note() clears the byte log; release still uses the original held channel/pitch.
stepFollow.bytes.length=0;stepFollow.midi.note(131,60,39);
assert.deepEqual(stepFollow.bytes,[131,62,39]);
assert.notEqual(stepCopy.state.getvalueof()[1],'step-host');
assert.equal(stepCopy.state.getvalueof()[4],0);
assert.equal(stepHost.state.getvalueof()[12],undefined);
assert.match(last(stepFollow.ui,'source_status'),/Following/);
console.log('Every identity poll preserves Host/source/scale and held-note release passed');
// User edits reach the simulated pattr client only through save notifications.
reset();const savedHost=make(2400,record('saved-host',1)),savedFollow=make(2401,record('saved-follow',0));savedHost.transport.init();savedFollow.transport.init();run();
// Add G-sharp to G Major: relative notes 0,1,2,4,5,7,9,11; mask 2743.
savedHost.state.rootselect(7);savedHost.state.toggle(8);savedHost.state.blackselect(1);run();
savedFollow.state.sourceselect(2);run();savedFollow.state.blackselect(1);
const hostBlob=savedHost.saved(),followerBlob=savedFollow.saved();
assert.deepEqual(hostBlob,[4,'saved-host','set-A','Local',1,'','','',7,2743,'Custom',1]);
assert.deepEqual(followerBlob,[4,'saved-follow','set-A','WhiteKeys',0,'set-A','saved-host','Piano',7,2743,'Custom',1]);
// A rejected restore cannot replace the last valid notified blob.
savedHost.state.setvalueof(4,'broken');assert.deepEqual(savedHost.saved(),hostBlob);
// Reading the saved snapshot cannot mutate the retained client value.
const detached=savedFollow.saved();detached[6]='wrong-host';assert.deepEqual(savedFollow.saved(),followerBlob);
reset();const reopenedFollow=make(2501,followerBlob),reopenedHost=make(2500,hostBlob);reopenedFollow.transport.init();reopenedHost.transport.init();run();
assert.deepEqual(Array.from(reopenedHost.state.getvalueof()),hostBlob);assert.deepEqual(Array.from(reopenedFollow.state.getvalueof()),followerBlob);
assert.match(last(reopenedFollow.ui,'source_status'),/Following/);assert.deepEqual(reopenedFollow.note(),[144,67,90,128,67,23]);
console.log('Save-notified custom scale/Black Keys/source survive invalid restore and reopen passed');
