// Production adapter/model/MIDI through controlled native LiveAPI.
const assert=require('assert');
const {make,run,last,record,reset,devices,remove,nativeGraph}=require('./sharing-test-fixture.cjs');
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

// Native traversal includes return, master and nested Rack chains.
for(const placement of ['return','master','rack']){
 reset();const graph=nativeGraph();
 if(placement==='return')graph.container(30,'Return A',1,'return_tracks');
 if(placement==='rack'){graph.rack(40,10);graph.container(41,'Chain',40,'chains');graph.rack(42,41);graph.container(43,'Inner chain',42,'chains');}
 const parent=placement==='return'?30:placement==='master'?20:43;
 const nestedHost=make(1800,record('nested-host',1,7),{parent}),nestedFollow=make(1801,[4,'nested-follow','set-A','WhiteKeys',0,'set-A','nested-host','Piano',0,2741,'Major',0]);
 nestedFollow.transport.init();nestedHost.transport.init();run();
 assert.deepEqual(nestedFollow.note(),[144,67,90,128,67,23]);
 remove(1800);run();assert.equal(last(nestedFollow.ui,'source_status'),'Waiting for Host');assert.deepEqual(nestedFollow.note(),[144,67,90,128,67,23]);
}
console.log('Return/master/nested Rack discovery and removed Host retained scale passed');
// A late native enrollment must reconnect without an explicit Host action.
reset();const lateHost=make(1900,record('late-host',1,7),{enrollmentReady:false}),lateFollow=make(1901,[4,'late-follow','set-A','WhiteKeys',0,'set-A','late-host','Piano',2,2741,'Major',0]);lateHost.transport.init();lateFollow.transport.init();run();
assert.equal(last(lateFollow.ui,'source_status'),'Waiting for Host');assert.deepEqual(lateFollow.note(),[144,62,90,128,62,23]);
nativeGraph().enrollment(1900,true);run();assert.match(last(lateFollow.ui,'source_status'),/Following/);assert.deepEqual(lateFollow.note(),[144,67,90,128,67,23]);
console.log('Late native enrollment reconnects automatic Follow passed');
// Literal native names keep the captured short-name regression independent of patch metadata.
for(const markerName of ['WK enrollment','WhiteKeys sharing enrollment','Unrelated parameter']){
 reset();const namedHost=make(2000,record('named-host',1,7),{markerName}),namedFollow=make(2001,[4,'named-follow','set-A','WhiteKeys',0,'set-A','named-host','Piano',2,2741,'Major',0]);namedHost.transport.init();namedFollow.transport.init();run();
 assert.deepEqual(namedFollow.note(),markerName==='Unrelated parameter'?[144,62,90,128,62,23]:[144,67,90,128,67,23]);
}
console.log('Observed short/compatible long enrollment names and unrelated parameter rejection passed');
// Cold identity ownership follows native traversal, even across different containers.
reset();const orderedGraph=nativeGraph();orderedGraph.container(30,'Return A',1,'return_tracks');orderedGraph.rack(40,10);orderedGraph.container(41,'Chain',40,'chains');
const masterCopy=make(2200,record('nested-collision',1,2),{parent:20}),returnCopy=make(2201,record('nested-collision',1,7),{parent:30}),rackCopy=make(2202,record('nested-collision',1,9),{parent:41}),orderedFollow=make(2203,[4,'ordered-follow','set-A','WhiteKeys',0,'set-A','nested-collision','Piano',0,2741,'Major',0]);
masterCopy.transport.init();returnCopy.transport.init();orderedFollow.transport.init();rackCopy.transport.init();run(15);
assert.equal(rackCopy.state.getvalueof()[1],'nested-collision');assert.equal(rackCopy.state.getvalueof()[4],1);assert.notEqual(masterCopy.state.getvalueof()[1],'nested-collision');assert.notEqual(returnCopy.state.getvalueof()[1],'nested-collision');assert.equal(masterCopy.state.getvalueof()[4],0);assert.equal(returnCopy.state.getvalueof()[4],0);assert.deepEqual(orderedFollow.note(),[144,69,90,128,69,23]);
console.log('Cold identity resolution retains native Rack/return/master order passed');
