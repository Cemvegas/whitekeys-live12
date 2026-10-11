// Native allocation pressure at the actual adapter init -> scheduled tick seam.
// Real Live's captured main-thread profile identified LiveAPI constructor pressure.
// This fixture counts the calls; it does not simulate native elapsed time or a Live acceptance.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nativeHandles=[];
let constructors=0,gets=0,parameterNameQueries=0,uiMessages=0,table='',scheduled;
const graph={1:{tracks:['id',10],return_tracks:[]},10:{name:['Track'],canonical_parent:['id',1],devices:['id',100]},20:{devices:[]},100:{name:['WhiteKeys'],canonical_parent:['id',10],parameters:['id',1000],can_have_chains:[0]},1000:{name:['WhiteKeys sharing enrollment']},99:{}};
function LiveAPI(callback,path){constructors++;nativeHandles.push(this);this.id=path==='live_set'?1:path==='this_device'?100:path==='live_set master_track'?20:path==='live_set master_track mixer_device volume'?99:Number(path.slice(3));this.path='live_set tracks 0 devices 0';this.get=property=>{if(this.id===1&&(property==='name'||property==='canonical_parent'))throw new Error('Song has no '+property);gets++;if(property==='name'&&this.id>=1000)parameterNameQueries++;return (graph[this.id]||{})[property]||[]};}
let context;const record=[4,'one','set-A','Local',0,'','','',0,2741,'Major',0];
const model={message(cmd,...a){uiMessages++;if(cmd==='sharingcontext')context.sharingstate(JSON.stringify({record,valid:1}));}};
context={arrayfromargs:a=>Array.from(a),Global:function(){Object.defineProperty(this,'data',{get:()=>table,set:v=>table=v})},LiveAPI,Task:function(callback){scheduled=callback;this.cancel=()=>{};this.schedule=()=>{};this.repeat=()=>{}},post:()=>{},outlet:()=>{},patcher:{getnamed:n=>n==='song_anchor'?{message(cmd){if(cmd==='getid')context.nativeanchor('id',99)}}:model}};
vm.createContext(context);vm.runInContext(fs.readFileSync('whitekeys-sharing.js','utf8'),context);context.sharingstate(JSON.stringify({record,valid:1}));context.init();scheduled();
const initial=constructors,initialNames=parameterNameQueries,initialMessages=uiMessages;const started=performance.now();for(let i=0;i<20;i++)scheduled();const warm=constructors-initial;
console.log(JSON.stringify({scenario:'one idle WhiteKeys, 20 scheduled polls',initialNativeObjects:initial,additionalNativeObjects:warm,repeatedParameterNames:parameterNameQueries-initialNames,nativeQueries:gets,unchangedModelMessages:uiMessages-initialMessages,fixtureMilliseconds:Math.round(performance.now()-started)}));
assert.equal(warm,0,'Idle polling must not keep allocating native LiveAPI objects on Live’s main thread');
assert.equal(parameterNameQueries-initialNames,0,'Unchanged enrollment parameters must not be read again on every poll');
assert.equal(uiMessages-initialMessages,0,'Unchanged discovery must not continuously repaint the model/panel');
console.log('Idle native allocation/enrollment/panel regression passed');
// A larger Set stabilizes after discovery too; parameter count must not multiply
// native construction or unchanged UI work on subsequent scheduled polls.
graph[10].devices.push('id',200);graph[200]={name:['Instrument'],canonical_parent:['id',10],parameters:[],can_have_chains:[0]};
for(let i=0;i<64;i++){graph[200].parameters.push('id',2000+i);graph[2000+i]={name:['Parameter '+i]};}
scheduled();const expanded=constructors,expandedNames=parameterNameQueries,expandedMessages=uiMessages;
for(let i=0;i<20;i++)scheduled();assert.equal(constructors-expanded,0);assert.equal(parameterNameQueries-expandedNames,0);assert.equal(uiMessages-expandedMessages,0);
console.log('64-parameter Set: zero additional native objects/name reads/unchanged panel messages passed');
const removed=nativeHandles.filter(h=>h.id===200||(h.id>=2000&&h.id<2064));assert.equal(removed.length,65);graph[10].devices=['id',100];scheduled();assert.ok(removed.every(h=>h.id===0),'Removed native associations must be detached');
console.log('Removed device and all 64 parameter handles released passed');
context.dispose();const beforeReinit=constructors;context.init();assert.ok(constructors>beforeReinit,'Reinitialization must obtain fresh native handles');
console.log('Fresh native handles on device reinitialization passed');
