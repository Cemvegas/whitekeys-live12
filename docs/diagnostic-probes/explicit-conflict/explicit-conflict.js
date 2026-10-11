// #19 diagnostic only. Native persistence and lifecycle require user Live acceptance.
autowatch=0;inlets=1;outlets=2;
var bus=new Global('whitekeys_explicit_conflict_probe_20261011');
var uid='',hosting=0,target='',root=0,mask=2741,anchored=0,blocked=0;
var scope='',runtime=0,master=0,anchor=-1,ready=0,foreign=0,task=null;
var token=String(new Date().getTime())+'-'+Math.random(),menuIds=[],choiceTokens=[],choiceSignature='',sourceView='',choiceView='',notice='';
function fresh(){return 'wk-'+new Date().getTime()+'-'+Math.floor(Math.random()*1000000000);}
function read(){try{return JSON.parse(bus.data||'{}');}catch(e){return {};}}
function write(b){bus.data=JSON.stringify(b);}
function integer(x,min,max){return typeof x==='number'&&x===Math.floor(x)&&x>=min&&x<=max;}
function setvalueof(){var a=arrayfromargs(arguments);if(a.length===1&&a[0] instanceof Array)a=a[0];
 if((a.length!==6&&a.length!==7)||a[0]!==1||typeof a[1]!=='string'||!a[1]||!integer(a[2],0,1)||typeof a[3]!=='string'||(a[2]&&a[3])||!integer(a[4],0,11)||!integer(a[5],1,4095)||!(a[5]&1)||(a.length===7&&!integer(a[6],0,1)))return;
 uid=a[1];hosting=a[2];target=a[3];root=a[4];mask=a[5];blocked=a.length===7?a[6]:0;anchored=1;
}
function applyAssignment(b){var r=b[token];if(r&&r.blocked&&!blocked){blocked=1;notifyclients();}if(r&&r.assignment){uid=r.assignment.uid;hosting=r.assignment.host;blocked=0;delete r.assignment;write(b);notifyclients();}}
function getvalueof(){if(ready)applyAssignment(read());return [1,uid,hosting,target,root,mask,blocked];}
function init(){if(task)task.cancel();task=null;ready=0;anchor=-1;
 try{var song=new LiveAPI(null,'live_set'),dev=new LiveAPI(null,'this_device');scope='set-'+song.id;runtime=Number(dev.id);master=Number(new LiveAPI(null,'live_set master_track mixer_device volume').id);if(!Number(song.id)||!runtime||!master)throw new Error('API not ready');this.patcher.getnamed('song_anchor').message('getid');}
 catch(e){notice='Waiting for native API: '+e.message;outlet(0,'set',notice);}}
function anchor_set(kind,id){if(kind!=='id'||!scope)return;anchor=Number(id);
 // No elapsed-time assumption and no raw runtime ownership comparison.
 if(anchored&&anchor!==master){foreign=1;notice='Set reference unresolved / foreign — sharing blocked';}
 else{foreign=0;if(!uid){uid=fresh();hosting=0;notifyclients();}this.patcher.getnamed('song_anchor').message('id',master);}
 ready=1;if(!task){task=new Task(tick,this);task.interval=100;task.repeat();}tick();}
function peers(b,id){var a=[];for(var k in b){var r=b[k];if(r.scope===scope&&r.uid===id&&!r.foreign)a.push(r);}return a;}
function signature(a){return a.map(function(r){return r.token;}).sort().join('|');}
function publish(b){b[token]={token:token,scope:scope,runtime:runtime,uid:uid,host:hosting,target:target,root:root,mask:mask,foreign:foreign,blocked:blocked,label:label()};}
function tick(){if(!ready)return;var b=read();applyAssignment(b);b=read();
 // Runtime is used only to replace a registration for this currently loaded instance.
 for(var k in b)if(k!==token&&b[k].scope===scope&&b[k].runtime===runtime)delete b[k];
 publish(b);write(b);var group=peers(b,uid),conflict=group.length>1||blocked,hosts=[],found=null;
 if(conflict){for(var g=0;g<group.length;g++)group[g].blocked=1;if(!blocked){blocked=1;notifyclients();}write(b);}
 for(var k in b){var r=b[k];if(r.scope===scope&&!r.foreign&&r.host&&!r.blocked&&r.uid!==uid&&peers(b,r.uid).length===1)hosts.push(r);}
 if(!foreign&&!conflict&&target){for(var i=0;i<hosts.length;i++)if(hosts[i].uid===target)found=hosts[i];if(found&&(root!==found.root||mask!==found.mask)){root=found.root;mask=found.mask;notifyclients();publish(b);write(b);}}
 render(group,hosts,found,conflict);outlet(1,'configure',root,mask);
 outlet(0,'set','DIAGNOSTIC / NOT ACCEPTED\nID '+uid+' | runtime '+runtime+' | Host preference '+hosting+'\nScope '+scope+' | restored Master '+anchor+' / current '+master+'\nSource '+(target||'Local')+' | Root '+root+' | Mask '+mask+'\n'+notice);}
function label(){try{var d=new LiveAPI(null,'this_device'),p=new LiveAPI(null,'this_device canonical_parent');return p.get('name').join(' ')+' / '+d.get('name').join(' ')+' / '+d.path+' [current ID '+runtime+']';}catch(e){return 'Device [current ID '+runtime+']';}}
function render(group,hosts,found,conflict){
 var ids=[''],labels=['Local'];
 for(var i=0;i<hosts.length;i++){ids.push(hosts[i].uid);labels.push(hosts[i].label);}
 if(target&&ids.indexOf(target)<0){ids.push(target);labels.push('Source unavailable');}
 var sourceSignature=JSON.stringify([ids,labels,target]);
 if(sourceSignature!==sourceView){
  var m=this.patcher.getnamed('source_menu');m.message('clear');
  for(var j=0;j<labels.length;j++)m.message('append',labels[j]);
  menuIds=ids;m.message('set',Math.max(0,ids.indexOf(target)));sourceView=sourceSignature;
 }
 var choices=[''],choiceLabels=['Choose device to keep identity'];
 if(conflict)for(var k=0;k<group.length;k++){choices.push(group[k].token);choiceLabels.push(group[k].label);}
 var nextChoiceView=JSON.stringify([choices,choiceLabels]);
 if(nextChoiceView!==choiceView){
  var c=this.patcher.getnamed('choice_menu');c.message('clear');
  for(var n=0;n<choiceLabels.length;n++)c.message('append',choiceLabels[n]);
  choiceTokens=choices;choiceSignature=signature(group);c.message('set',0);choiceView=nextChoiceView;
 }
 this.patcher.getnamed('host_toggle').message('set',hosting);this.patcher.getnamed('root_menu').message('set',root);
 this.patcher.getnamed('connection').message('set',foreign?'Set reference unresolved — sharing blocked':conflict?'Identity conflict — choose keeper':target?(found?'Following: '+found.label:'Source unavailable — last scale kept'):(hosting?'Host ON':'Local — Host OFF'));
}
function choose(i){var selected=choiceTokens[Number(i)],b=read(),group=peers(b,uid);if(foreign||(!blocked&&group.length<2)||signature(group)!==choiceSignature||!selected){notice='Selection expired — refresh candidates';tick();return;}
 var keeper=null;for(var j=0;j<group.length;j++)if(group[j].token===selected)keeper=group[j];if(!keeper){tick();return;}
 var allocated={};for(var k in b)allocated[b[k].uid]=1;
 for(var n=0;n<group.length;n++){var r=group[n];if(r.token!==selected){var next=fresh();while(allocated[next])next=fresh();allocated[next]=1;r.uid=next;r.host=0;r.assignment={uid:next,host:0};}else{r.assignment={uid:r.uid,host:r.host};}r.blocked=0;}
 write(b);notice='Selection applied — save Set to persist';tick();}
function host(v){if(!ready||foreign)return;hosting=Number(v)?1:0;if(hosting)target='';notifyclients();tick();}
function sourceselect(i){if(!ready||foreign)return;i=Number(i);if(menuIds[i]===undefined)return;target=menuIds[i];if(target)hosting=0;notifyclients();tick();}
function rootselect(v){if(target||!integer(Number(v),0,11))return;root=Number(v);notifyclients();tick();}
function scaleselect(v){if(target)return;mask=Number(v)===0?2741:Number(v)===1?1709:1757;notifyclients();tick();}
function refresh(){init();}
function notifydeleted(){if(task)task.cancel();var b=read();delete b[token];write(b);}
