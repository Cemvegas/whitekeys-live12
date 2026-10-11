// THROWAWAY: communication/identity probe only; no MIDI mapping or production code.
autowatch=0;inlets=1;outlets=1;
var bus=new Global('whitekeys_sharing_probe_v1'),uid='',token=String(new Date().getTime())+'-'+Math.random(),scope='',runtime=0,ownerRuntime=0,hosting=0,target='',root=0,notes=[0,2,4,5,7,9,11],task=null,notice='',menuIds=[],menuSignature='';
function fresh(){return 'wk-'+new Date().getTime()+'-'+Math.floor(Math.random()*1000000000);}
function read(){try{return JSON.parse(bus.data||'{}');}catch(e){return {};}}
function write(b){bus.data=JSON.stringify(b);}
function getvalueof(){return [2,uid,hosting,target,root,ownerRuntime].concat(notes);}
function setvalueof(){
 var a=arrayfromargs(arguments);if(a.length===1&&a[0] instanceof Array)a=a[0];
 if(a.length<7||a.length>18||a[0]!==2||typeof a[1]!=="string"||!a[1]||a[1]==="undefined"||
 (a[2]!==0&&a[2]!==1)||typeof a[3]!=="string"||a[3]==="undefined"||
 typeof a[4]!=="number"||a[4]!==Math.floor(a[4])||a[4]<0||a[4]>11||
 typeof a[5]!=="number"||a[5]!==Math.floor(a[5])||a[5]<=0||a[6]!==0)return;
 for(var i=6;i<a.length;i++){if(typeof a[i]!=="number"||a[i]!==Math.floor(a[i])||a[i]<0||a[i]>11||(i>6&&a[i]<=a[i-1]))return;}
 uid=a[1];hosting=a[2];target=a[3];root=a[4];ownerRuntime=a[5];notes=a.slice(6);
}
function resolveIdentity(id){
 if(!uid||ownerRuntime!==id){uid=fresh();hosting=0;ownerRuntime=id;notice='New owner: fresh ID, Host OFF';notifyclients();}
}

function init(){try{var song=new LiveAPI(null,'live_set'),dev=new LiveAPI(null,'this_device');scope='set-'+song.id;runtime=Number(dev.id);if(!Number(song.id)||!runtime)throw new Error('API not ready');this.patcher.getnamed('identity_anchor').message('id',runtime);var freshFixture=!uid;resolveIdentity(runtime);if(freshFixture){host(1);eight();}if(task)task.cancel();task=new Task(tick,this);task.interval=250;task.repeat();tick();}catch(e){outlet(0,'set','Waiting for Live API: '+e.message);}}
function tick(){if(!scope)return;var b=read(),now=new Date().getTime(),key=scope+'|'+uid,old=b[key];if(old&&old.token!==token&&now-old.time<2000){uid=fresh();hosting=0;notice='Identity collision: new ID, Host OFF';key=scope+'|'+uid;notifyclients();}
var candidates=[];for(var k in b){var r=b[k];if(now-r.time>2000){delete b[k];continue;}if(r.scope===scope&&r.host&&r.uid!==uid)candidates.push(r);}
var found=null;for(var i=0;i<candidates.length;i++)if(candidates[i].uid===target)found=candidates[i];if(target&&found){var changed=root!==found.root||notes.join(',')!==found.notes.join(',');root=found.root;notes=found.notes.slice(0);if(changed)notifyclients();}b[key]={scope:scope,uid:uid,token:token,runtime:runtime,time:now,host:hosting,root:root,notes:notes,label:label()};write(b);
renderUI(candidates,found);outlet(0,'set','Scope '+scope+' | Runtime '+runtime+'\nID '+uid+' | Owner '+ownerRuntime+' | Host '+hosting+'\nFollowing '+(target||'Local')+(target&&!found?' — Source unavailable':'')+'\nRoot '+root+' | Notes '+notes.join(' ')+'\nSources: '+candidates.map(function(r){return r.label+' ['+r.uid+']';}).join('; ')+'\n'+notice);}
function label(){try{var d=new LiveAPI(null,'this_device'),p=new LiveAPI(null,'this_device canonical_parent');return p.get('name').join(' ')+' · '+d.get('name').join(' ');}catch(e){return 'Unknown device';}}
function host(v){hosting=Number(v)?1:0;if(hosting)target='';notifyclients();tick();}
function local(){target='';notifyclients();tick();}
function followfirst(){var b=read(),now=new Date().getTime();for(var k in b){var r=b[k];if(r.scope===scope&&r.host&&r.uid!==uid&&now-r.time<2000){follow(r.uid);return;}}notice='No available Host';tick();}
function follow(id){target=String(id);hosting=0;notifyclients();tick();}
function eight(){if(target)return;notes=[0,2,3,4,6,7,9,10];notifyclients();tick();}
function major(){if(target)return;notes=[0,2,4,5,7,9,11];notifyclients();tick();}
function notifydeleted(){if(task)task.cancel();var b=read(),key=scope+'|'+uid;if(b[key]&&b[key].token===token){delete b[key];write(b);}}

function ui(n){return this.patcher.getnamed(n);}
function renderUI(candidates,found){
 var ids=[''],labels=['Local'];for(var i=0;i<candidates.length;i++){ids.push(candidates[i].uid);labels.push('Follow: '+candidates[i].label);}
 if(target&&ids.indexOf(target)<0){ids.push(target);labels.push('Follow: Source unavailable');}
 var sig=ids.join('|')+'::'+labels.join('|'),m=ui('source_menu');if(sig!==menuSignature){m.message('clear');for(var j=0;j<labels.length;j++)m.message('append',labels[j]);menuSignature=sig;}menuIds=ids;m.message('set',Math.max(0,ids.indexOf(target)));
 ui('host_toggle').message('set',hosting);ui('root_menu').message('set',root);
 var code=notes.join(','),scale=code==='0,2,4,5,7,9,11'?0:code==='0,2,3,5,7,9,10'?1:2;ui('scale_menu').message('set',scale);
 ui('connection').message('set',target?(found?'Following: '+found.label:'Source unavailable — last scale kept'):(hosting?'Host ON — sharing this scale':'Local — Host OFF'));
 var nn=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];ui('scale_status').message('set',nn[root]+' '+['Major','Dorian','8-note Custom'][scale]+' | '+notes.map(function(n){return nn[(root+Number(n))%12];}).join(' '));
}
function sourceselect(i){i=Number(i);if(i===0)local();else if(menuIds[i])follow(menuIds[i]);}
function rootselect(i){if(target)return;root=Number(i);notifyclients();tick();}
function scaleselect(i){if(target)return;i=Number(i);notes=i===0?[0,2,4,5,7,9,11]:i===1?[0,2,3,5,7,9,10]:[0,2,3,4,6,7,9,10];notifyclients();tick();}
