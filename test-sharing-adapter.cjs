// Production adapter/model/MIDI through controlled native LiveAPI.
const assert=require('assert');
const {make,run,last,record,reset,devices,remove}=require('./sharing-test-fixture.cjs');
reset();const discoveryHost=make(90,record('discovery-host',1,7)),discoveryFollower=make(91,record('discovery-follower',0));discoveryHost.transport.init();discoveryFollower.transport.init();run();discoveryFollower.state.sourceselect(2);run();assert.deepEqual(discoveryFollower.note(),[144,67,90,128,67,23]);console.log('Native enrollment discovery and automatic Follow MIDI passed');
reset();const ah=make(500,record('host',1,7),{deferAnchor:true}),af=make(501,[4,'follow','set-A','WhiteKeys',0,'set-A','host','Piano',0,2741,'Major',0]);ah.transport.init();af.transport.init();run();assert.deepEqual(af.note(),[144,60,90,128,60,23]);ah.transport.nativeanchor('id',99);run();assert.deepEqual(af.note(),[144,67,90,128,67,23]);const foreign=make(502,[4,'alien','other-set','Local',1,'','','',2,2741,'Major',0],{anchor:88});foreign.transport.init();run();ah.state.rootselect(9);run();assert.deepEqual(af.note(),[144,69,90,128,69,23]);assert.match(last(foreign.ui,'source_status'),/different Set/);
console.log('Deferred native anchor and foreign-device isolation without stalling independent Host passed');
reset();const foreignFirst=make(700,[4,'alien','other-set','Local',1,'','','',2,2741,'Major',0],{anchor:88}),realHost=make(701,record('real-host',1,7)),realFollow=make(702,[4,'real-follow','set-A','WhiteKeys',0,'set-A','real-host','Piano',0,2741,'Major',0]);foreignFirst.transport.init();realFollow.transport.init();realHost.transport.init();run();assert.deepEqual(realFollow.note(),[144,67,90,128,67,23]);
// AC19/20/23: explicit handoff through real production messages and MIDI.
reset();const h1=make(1100,record('host-A',0,2)),h2=make(1101,record('host-B',0,7)),auto=make(1102,record('auto',0));
for(const d of devices)d.transport.init();run();auto.state.sourceselect(2);run();assert.equal(last(auto.ui,'source_status'),'Waiting for Host');
h1.state.hostselect(1);run();assert.deepEqual(auto.note(),[144,62,90,128,62,23]);
auto.bytes.length=0;auto.midi.note(147,60,101);h2.state.hostselect(1);run();auto.midi.note(131,60,39);assert.deepEqual(auto.bytes,[147,62,101,131,62,39]);
assert.equal(h1.state.getvalueof()[4],0);assert.equal(h1.state.getvalueof()[3],'Local');assert.equal(h1.state.getvalueof()[8],2);assert.equal(last(h1.ui,'host_toggle'),0);assert.equal(last(h2.ui,'host_toggle'),1);assert.deepEqual(auto.note(),[144,67,90,128,67,23]);
h1.state.rootselect(9);run();assert.deepEqual(auto.note(),[144,67,90,128,67,23]);h2.state.hostselect(0);run();assert.equal(last(auto.ui,'source_status'),'Waiting for Host');h2.state.hostselect(1);run();assert.deepEqual(auto.note(),[144,67,90,128,67,23]);
h1.state.hostselect(1);h2.state.hostselect(1);run();assert.equal(h1.state.getvalueof()[4],0);assert.equal(h2.state.getvalueof()[4],1);
auto.state.hostselect(1);run();assert.equal(auto.state.getvalueof()[3],'Local');assert.equal(h2.state.getvalueof()[4],0);assert.equal(auto.state.getvalueof()[4],1);
console.log('Automatic Follow, explicit single Host handoff, retained scale and held MIDI passed');
// Distinct restored preferences wait for an explicit action in either discovery order.
for(const order of [[0,1],[1,0]]){
 reset();const restored=[make(1300,record('restored-A',1,2)),make(1301,record('restored-B',1,7))],rFollow=make(1302,record('waiting',0));rFollow.transport.init();for(const i of order)restored[i].transport.init();run();rFollow.state.sourceselect(2);run();assert.equal(last(rFollow.ui,'source_status'),'Host conflict');for(const h of restored)assert.equal(last(h.ui,'host_toggle'),0);restored[1].state.hostselect(1);run();assert.equal(restored[0].state.getvalueof()[4],0);assert.deepEqual(rFollow.note(),[144,67,90,128,67,23]);
}
console.log('Distinct saved Host conflict never elects by discovery order passed');
reset();const failure={censusError:false},retryHost=make(1600,record('retry-host',1,7),failure),retryFollow=make(1601,record('retry-follow',0));retryHost.transport.init();retryFollow.transport.init();run();retryFollow.state.sourceselect(2);run();failure.censusError=true;retryHost.transport.tick();failure.censusError=false;run();assert.deepEqual(retryFollow.note(),[144,67,90,128,67,23]);console.log('Transient native census failure recovers automatic Follow passed');
