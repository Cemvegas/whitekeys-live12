// Live boundary substitute exercises production scripts, not actual Live persistence.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const marker=JSON.parse(fs.readFileSync('WhiteKeys Live 12.maxpat','utf8')).patcher.boxes.find(b=>b.box.id==='enrollment').box;
const markerAutomatable=marker.parameter_enable===1&&marker.saved_attribute_attributes.valueof.parameter_invisible===0;
let liveIds=[],data='',counter=0;const nodes={},devices=[];
function make(runtime,record,options={}){liveIds.push(String(runtime));const ui={},out=[],bytes=[];let transport;
 const midi={arrayfromargs:a=>Array.from(a),outlet:(p,...a)=>{if(p===0)bytes.push(...a)},Task:function(){this.schedule=()=>{};this.cancel=()=>{}}};vm.createContext(midi);vm.runInContext(fs.readFileSync('whitekeys-midi.js','utf8'),midi);
 const state={arrayfromargs:a=>Array.from(a),notifyclients:()=>{},patcher:{getnamed:n=>({message:(...a)=>{(ui[n]||(ui[n]=[])).push(a)}})},outlet:(p,...a)=>{if(Array.isArray(a[0]))a=a[0];if(p===0)midi[a[0]](...a.slice(1));if(p===2){out.push(a);if(transport)transport[a[0]](...a.slice(1));}}};vm.createContext(state);vm.runInContext(fs.readFileSync('whitekeys-state.js','utf8'),state);state.setvalueof(...record);
 nodes[String(runtime)]={name:['WhiteKeys'],parameters:markerAutomatable?['id',runtime+1000]:[],canonical_parent:['id',10],can_have_chains:[0]};// Live 12 exposes the short parameter name (captured from the production device).
 nodes[runtime+1000]={name:[marker.saved_attribute_attributes.valueof.parameter_shortname]};
 function LiveAPI(cb,path){if(path==='this_device')this.id=runtime;else if(path==='live_set')this.id=1;else if(path==='live_set master_track mixer_device volume')this.id=99;else if(path==='live_set master_track')this.id=20;else this.id=Number(path.replace('id ',''));this.path='live_set tracks 0 devices '+liveIds.indexOf(String(this.id));this.get=p=>{if(options.censusError&&this.id===1)throw new Error('API pending');if(this.id===1){if(p==='name'||p==='canonical_parent')throw new Error('Song has no '+p);return p==='tracks'?['id',10]:[];}if(this.id===10)return p==='devices'?liveIds.flatMap(x=>['id',Number(x)]):p==='name'?['Piano']:p==='canonical_parent'?['id',1]:[];if(this.id===20)return [];return (nodes[this.id]||{})[p]||[];};}
 const anchor={message:(cmd,id)=>{if(cmd==='getid'&&!options.deferAnchor)transport.nativeanchor('id',options.anchor??99)}};
 transport={Global:function(){Object.defineProperty(this,'data',{get:()=>data,set:x=>data=x})},Date:class extends Date {getTime(){return 1000+counter++}},arrayfromargs:a=>Array.from(a),post:()=>{},outlet:()=>{},Task:function(){this.cancel=()=>{};this.schedule=()=>{};this.repeat=()=>{}},LiveAPI,patcher:{getnamed:n=>n==='song_anchor'?anchor:{message:(cmd,...a)=>state[cmd](...a)}}};vm.createContext(transport);vm.runInContext(fs.readFileSync('whitekeys-sharing.js','utf8'),transport);transport.sharingstate(JSON.stringify({record:Array.from(state.getvalueof()),valid:1}));
 const d={state,transport,ui,out,bytes,midi,note(){bytes.length=0;midi.note(144,60,90);midi.note(128,60,23);return bytes.slice()}};devices.push(d);return d;
}
function run(n=5){for(let i=0;i<n;i++)for(const d of devices)d.transport.tick()}
function menuItems(d){let a=[];for(const m of d.ui.conflict_menu||[]){if(m[0]==='clear')a=[];if(m[0]==='append')a.push(m[1]);}return a.slice(1)}
function last(ui,name){return (ui[name]||[]).filter(a=>a[0]==='set').at(-1)?.[1]}
const record=(id,host,root=0)=>[4,id,'set-A','Local',host,'','','',root,2741,'Major',0];

function reset(){liveIds=[];data='';devices.length=0;for(const k in nodes)delete nodes[k]}
function reorder(order){liveIds=order.map(String)}
module.exports={reorder,make,run,menuItems,last,record,reset,devices,remove(runtime){liveIds=liveIds.filter(id=>id!==String(runtime));const index=devices.findIndex(d=>String(d.transport.runtime)===String(runtime));if(index>=0)devices.splice(index,1);}};
