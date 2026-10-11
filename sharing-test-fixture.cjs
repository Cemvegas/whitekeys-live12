// Live boundary substitute exercises production scripts, not actual Live persistence.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const marker=JSON.parse(fs.readFileSync('WhiteKeys Live 12.maxpat','utf8')).patcher.boxes.find(b=>b.box.id==='enrollment').box;
const markerAutomatable=marker.parameter_enable===1&&marker.saved_attribute_attributes.valueof.parameter_invisible===0;
// Only the native properties used by production discovery are simulated.
// Observed names are literals; patch metadata decides whether enrollment is exposed.
function createNativeGraph(){
 const nodes={1:{tracks:['id',10],return_tracks:[]},10:{name:['Piano'],canonical_parent:['id',1],devices:[]},20:{name:['Master'],canonical_parent:['id',1],devices:[]},99:{}};
 function append(parent,property,id){(nodes[parent][property]||(nodes[parent][property]=[])).push('id',id);}
 function container(id,name,parent,property){nodes[id]={name:[name],canonical_parent:['id',parent],devices:[]};append(parent,property,id);}
 function rack(id,parent){nodes[id]={name:['Rack'],canonical_parent:['id',parent],parameters:[],can_have_chains:[1],chains:[]};append(parent,'devices',id);}
 function enroll(id,{parent=10,markerName='WK enrollment',enrollmentReady=true}={}){
  nodes[id]={name:['WhiteKeys'],parameters:markerAutomatable&&enrollmentReady?['id',id+1000]:[],canonical_parent:['id',parent],can_have_chains:[0]};
  nodes[id+1000]={name:[markerName]};append(parent,'devices',id);
 }
 function remove(id){for(const node of Object.values(nodes))if(node.devices){const index=node.devices.indexOf(id);if(index>=0)node.devices.splice(index-1,2);}delete nodes[id];delete nodes[id+1000];}
 function liveAPI(runtime,options={},observe=()=>{}){
  return function LiveAPI(cb,path){
   this.id=path==='this_device'?runtime:path==='live_set'?1:path==='live_set master_track mixer_device volume'?99:path==='live_set master_track'?20:Number(path.replace('id ',''));
   this.path='live_set';observe('construct',this);
   this.get=property=>{
    if(options.censusError&&this.id===1)throw new Error('Native discovery pending');
    if(this.id===1&&(property==='name'||property==='canonical_parent'))throw new Error('Song has no '+property);
    observe('get',this,property);return (nodes[this.id]||{})[property]||[];
   };
  };
 }
 function enrollment(id,ready){nodes[id].parameters=markerAutomatable&&ready?['id',id+1000]:[];}
 return {nodes,container,rack,enroll,enrollment,remove,liveAPI};
}
let graph=createNativeGraph(),data='',counter=0;const devices=[];
function make(runtime,record,options={}){graph.enroll(runtime,options);const ui={},out=[],bytes=[];let transport;
 const midi={arrayfromargs:a=>Array.from(a),outlet:(p,...a)=>{if(p===0)bytes.push(...a)},Task:function(){this.schedule=()=>{};this.cancel=()=>{}}};vm.createContext(midi);vm.runInContext(fs.readFileSync('whitekeys-midi.js','utf8'),midi);
 const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{(ui[n]||(ui[n]=[])).push(a)}})},outlet:(p,...a)=>{if(Array.isArray(a[0]))a=a[0];if(p===0)midi[a[0]](...a.slice(1));if(p===2){out.push(a);if(transport)transport[a[0]](...a.slice(1));}}};vm.createContext(state);vm.runInContext(fs.readFileSync('whitekeys-state.js','utf8'),state);state.setvalueof(...record);
 const LiveAPI=graph.liveAPI(runtime,options);
 const anchor={message:(cmd,id)=>{if(cmd==='getid'&&!options.deferAnchor)transport.nativeanchor('id',options.anchor??99)}};
 transport={Global:function(){Object.defineProperty(this,'data',{get:()=>data,set:x=>data=x})},Date:class extends Date {getTime(){return 1000+counter++}},arrayfromargs:a=>Array.from(a),post:()=>{},outlet:()=>{},Task:function(){this.cancel=()=>{};this.schedule=()=>{};this.repeat=()=>{}},LiveAPI,patcher:{getnamed:n=>n==='song_anchor'?anchor:{message:(cmd,...a)=>state[cmd](...a)}}};vm.createContext(transport);vm.runInContext(fs.readFileSync('whitekeys-sharing.js','utf8'),transport);transport.sharingstate(JSON.stringify({record:Array.from(state.getvalueof()),valid:1}));
 const d={state,transport,ui,out,bytes,midi,note(){bytes.length=0;midi.note(144,60,90);midi.note(128,60,23);return bytes.slice()}};devices.push(d);return d;
}
function run(n=5){for(let i=0;i<n;i++)for(const d of devices)d.transport.tick()}
function menuItems(d){let a=[];for(const m of d.ui.conflict_menu||[]){if(m[0]==='clear')a=[];if(m[0]==='append')a.push(m[1]);}return a.slice(1)}
function last(ui,name){return (ui[name]||[]).filter(a=>a[0]==='set').at(-1)?.[1]}
const record=(id,host,root=0)=>[4,id,'set-A','Local',host,'','','',root,2741,'Major',0];

function reset(){graph=createNativeGraph();data='';devices.length=0;}
function reorder(order){graph.nodes[10].devices=order.flatMap(id=>['id',Number(id)]);}
module.exports={createNativeGraph,nativeGraph:()=>graph,reorder,make,run,menuItems,last,record,reset,devices,remove(runtime){graph.remove(Number(runtime));const index=devices.findIndex(d=>String(d.transport.runtime)===String(runtime));if(index>=0)devices.splice(index,1);}};
