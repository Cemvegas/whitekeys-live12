// ES5 model. LiveAPI is isolated in whitekeys-api.js; persisted through a blob pattr.
autowatch = 0;
inlets = 1;
outlets = 3;
var pitchNames = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
var scaleNames = ['Major','Minor','Dorian','Mixolydian','Lydian','Phrygian','Locrian','Harmonic Minor','Melodic Minor','Major Pentatonic','Minor Pentatonic','Whole Tone','Custom'];
var scaleNotes = [[0,2,4,5,7,9,11],[0,2,3,5,7,8,10],[0,2,3,5,7,9,10],[0,2,4,5,7,9,10],[0,2,4,6,7,9,11],[0,1,3,5,7,8,10],[0,1,3,5,6,8,10],[0,2,3,5,7,8,11],[0,2,3,5,7,9,11],[0,2,4,7,9],[0,3,5,7,10],[0,2,4,6,8,10]];
var follow = 1, root = 0, name = 'Major', notes = scaleNotes[0].slice(0);
var activeRoot = 0, activeName = 'Major', active = notes.slice(0), black = 0;
var liveRoot = 0, liveName = 'Major', liveNotes = notes.slice(0), liveMode = 1;
var sourceMenuSignature='', menuSignature = '', menuEntries = [];
var apiReady = false, apiError = '', sharingNotice = '';
// Public sharing messages are delivered by the isolated native adapter.
var currentSet='', currentSession='', runtimeToken='', directory=[], sourceRevision=-1;
var sourceSession='', sourcePresent=false, sourceAvailable=false, identityBlocked=0, recordValid=true;
function sourceselect(v) {
    v=Number(v);
    if(v===0||v===1){sharingNotice='';followselect(v);return;}
    if(v===2){hostEnabled=0;follow=0;sourceKind='WhiteKeys';sourceSet='';sourceDevice='';sourceLabel='';sourceAvailable=false;render();save();return;}
    var peer=directory[v-3];
    if(!peer||!eligible(peer))return;
    follow=0;hostEnabled=0;sourceKind='WhiteKeys';sourceSet=peer.set;sourceDevice=peer.id;sourceLabel=peer.label;
    sourceRevision=-1;sourceSession=peer.session;sourcePresent=true;sourceAvailable=false;render();save();
}
function hostselect(v) { if(sourceKind==='WhiteKeys')return;hostEnabled=Number(v)===1?1:0;render();save(); }
function eligible(p) { return p&&p.set===currentSet&&token(p.id)&&p.id!==deviceIdentity&&p.host===1&&p.blocked===0&&(p.kind==='Local'||p.kind==='Live')&&token(p.session); }
function sharingcontext(set,session,runtime) {
    if(!token(set)||!token(session)||!token(runtime))return;
    currentSet=set;currentSession=session;runtimeToken=runtime;
    if(setIdentity==='unresolved')setIdentity=set;
    render();
}
function sharingdirectory(json) {
    var peers;try{peers=JSON.parse(String(json));}catch(e){return;}if(!(peers instanceof Array))return;
    var next=[],selected=null;
    for(var i=0;i<peers.length;i++){var p=peers[i];if(eligible(p)&&typeof p.label==='string'){next.push(p);if(p.id===sourceDevice&&p.set===sourceSet)selected=p;}}
    directory=next;sharingNotice='';
    sourcePresent=!!selected;
    if(!selected)sourceAvailable=false;
    else if(selected.session!==sourceSession){sourceSession=selected.session;sourceRevision=-1;sourceAvailable=false;}
    else sourceAvailable=sourceRevision>=0;
    render();
}
function sharingsnapshot(json) {
    var p;try{p=JSON.parse(String(json));}catch(e){return;}
    if(!p||!sourcePresent||identityBlocked||!recordValid||setIdentity!==currentSet||sourceKind!=='WhiteKeys'||p.set!==currentSet||p.set!==sourceSet||p.id!==sourceDevice||p.session!==sourceSession||!sourceSession||!integer(p.revision,0,9007199254740991)||p.revision<=sourceRevision||!integer(p.root,0,11)||!integer(p.mask,1,4095)||!(p.mask&1)||typeof p.name!=='string')return;
    sourceRevision=p.revision;root=activeRoot=p.root;name=activeName=p.name;notes=unmask(p.mask);active=notes.slice(0);sourceAvailable=true;render();
}
function sharingstatus(text) {sharingNotice=String(text);render();}
function sharingblocked(v) { v=Number(v)===1?1:0;if(identityBlocked===v)return;identityBlocked=v;sourceAvailable=false;sourceSession='';sourceRevision=-1;render();save(); }
function sharingidentity(id,host) { if(!identityBlocked||!token(id)||!integer(Number(host),0,1))return;deviceIdentity=id;hostEnabled=sourceKind==='WhiteKeys'?0:Number(host);render();save(); }
function sharingchoices(json) {
    var c;try{c=JSON.parse(String(json));}catch(e){return;}if(!(c instanceof Array))return;
    conflictChoices=c;var status=ui('source_status');if(status)status.message('hidden',c.length?1:0);var menu=ui('conflict_menu');if(menu){menu.message('clear');menu.message('append','Identity conflict: keep identity on...');for(var i=0;i<c.length;i++)menu.message('append',c[i].label);menu.message('hidden',c.length?0:1);menu.message('set',0);}
}
var conflictChoices=[];
function conflictselect(v) {var c=conflictChoices[Number(v)-1];if(c)outlet(2,'sharingchoose',c.signature,c.runtime);}
function mask(a) { var n=0; for(var i=0;i<a.length;i++) n |= 1<<a[i]; return n; }
function unmask(m) { var a=[]; for(var i=0;i<12;i++) if(m & (1<<i)) a.push(i); return a; }
function valid(a) { if(!a.length||a[0]!==0) return false; for(var i=0;i<a.length;i++) if(a[i]!==Math.floor(a[i])||a[i]<0||a[i]>11||(i&&a[i]<=a[i-1]))return false; return true; }
// Persistent identity and source references; native enrollment lives in the adapter.
var deviceIdentity = newIdentity(), setIdentity = 'unresolved', sourceKind = 'Live';
var hostEnabled = 0, sourceSet = '', sourceDevice = '', sourceLabel = '';
function newIdentity() { return 'wk-'+new Date().getTime().toString(36)+'-'+Math.floor(Math.random()*4294967296).toString(36)+'-'+Math.floor(Math.random()*4294967296).toString(36); }
function integer(v,min,max) { return typeof v==='number'&&v===Math.floor(v)&&v>=min&&v<=max; }
function token(v) { return typeof v==='string'&&v.length>0&&v.length<=256; }
function getvalueof() { var a=[4,deviceIdentity,setIdentity,sourceKind,hostEnabled,sourceSet,sourceDevice,sourceLabel,activeRoot,mask(active),activeName,black];if(identityBlocked)a.push(1);return a; }
function setvalueof() {
    var a=arrayfromargs(arguments); if(a.length===1&&a[0] instanceof Array)a=a[0];
    recordValid=false;outlet(2,'sharingstate',JSON.stringify({record:getvalueof(),valid:0}));
    var version=Number(a[0]),r,m,n,b,f;
    if(version===4) {
        if((a.length!==12&&a.length!==13)||(a.length===13&&!integer(a[12],0,1))||!token(a[1])||!token(a[2])||['Local','Live','WhiteKeys'].indexOf(a[3])<0||!integer(a[4],0,1)||typeof a[7]!=='string'||typeof a[10]!=='string'||!integer(a[11],0,1))return;
        if(a[3]==='WhiteKeys') { if(a[4]!==0||!((token(a[5])&&token(a[6]))||(a[5]===''&&a[6]===''&&a[7]===''))||(a[5]===a[2]&&a[6]===a[1]))return; }
        else if(a[5]!==''||a[6]!==''||a[7]!=='')return;
        r=a[8];m=a[9];n=a[10];b=a[11];f=a[3]==='Live'?1:0;
        if(!integer(r,0,11)||!integer(m,1,4095)||!valid(unmask(m)))return;
    } else {
        var old=version===2&&a.length===9;
        if(!old&&(version!==3||a.length!==10||!integer(Number(a[9]),0,1)))return;
        var dm=Number(a[4]),dr=Number(a[2]);r=Number(a[5]);m=Number(a[7]);n=String(a[6]);b=Number(a[8])===1?1:0;f=Number(a[1])?1:0;
        if(!integer(dm,1,4095)||!integer(m,1,4095)||!integer(dr,0,11)||!integer(r,0,11)||!valid(unmask(dm))||!valid(unmask(m))||(old&&unmask(m).length!==7))return;
    }
    // Commit only after every field passes; never resurrect an unapplied legacy notes.
    if(version===4){deviceIdentity=a[1];setIdentity=a[2];sourceKind=a[3];hostEnabled=a[4];sourceSet=a[5];sourceDevice=a[6];sourceLabel=a[7];}
    else {sourceKind=f?'Live':'Local';hostEnabled=0;sourceSet='';sourceDevice='';sourceLabel='';}
    recordValid=true;identityBlocked=version===4&&a.length===13?a[12]:0;sourceSession='';sourceRevision=-1;sourceAvailable=false;
    follow=f;root=activeRoot=r;name=activeName=n;notes=unmask(m);active=notes.slice(0);black=b;
    if(follow&&apiReady)useLive();
    if(sourceKind==='Local')name=activeName=recognizedName(notes);
    render();
}
function init() { if(follow&&apiReady)useLive();render(); }
function ui(id) { return this.patcher.getnamed(id); }
function setui(id,value) { var b=ui(id); if(b) b.message('set',value); }
function save() { notifyclients(); }
function recognizedName(a) { var m=mask(a);for(var i=0;i<scaleNotes.length;i++)if(mask(scaleNotes[i])===m)return scaleNames[i];return 'Custom'; }
function changed() { name=recognizedName(notes);active=notes.slice(0);activeRoot=root;activeName=name;render();save(); }
function useLive() { root=liveRoot;name=liveName;notes=liveNotes.slice(0);active=notes.slice(0);activeRoot=root;activeName=name; }
function livescale() {
    var a=arrayfromargs(arguments),r=Number(a.shift()),nm=String(a.shift()),mode=Number(a.shift());
    for(var i=0;i<a.length;i++)a[i]=Number(a[i]);
    if(r<0||r>11||r!==Math.floor(r)||!valid(a)){apistatus('Invalid Live scale data');return;}
    liveRoot=r;liveName=nm;liveNotes=a;liveMode=mode;apiReady=true;apiError='';
    if(follow) useLive();render(); // Observer updates are read-only: do not dirty the Set.
}
function apistatus() { apiReady=false;apiError=arrayfromargs(arguments).join(' ');render(); }
function rootselect(v) {
    v=Number(v);if(v<0||v>11||v!==Math.floor(v))return;
    if(sourceKind!=='Local')return;root=v;changed();
}
function scaleselect(v) {
    v=Number(v);if(v<0||v>=menuEntries.length||v!==Math.floor(v)||sourceKind!=='Local')return;
    var entry=menuEntries[v];if(entry.kind==='alternate'){root=entry.root;notes=entry.notes.slice(0);}
    else if(entry.kind==='catalog')notes=scaleNotes[entry.index].slice(0);
    else return; // Section labels and Custom describe membership, not an edit.
    changed();
}
function scaleMenu() {
    var entries=[],i,r,relative,m=0;
    for(i=0;i<scaleNames.length;i++)entries.push({label:scaleNames[i],kind:i<scaleNotes.length?'catalog':'description',index:i});
    if(scaleNames.indexOf(name)<0)entries.push({label:name,kind:'description'});
    for(i=0;i<notes.length;i++)m|=1<<((root+notes[i])%12);
    var alternatives=[];
    for(r=0;r<12;r++)if(r!==root){
        relative=0;for(i=0;i<12;i++)if(m&(1<<i))relative|=1<<((i-r+12)%12);
        for(i=0;i<scaleNotes.length;i++)if(mask(scaleNotes[i])===relative)alternatives.push({label:pitchNames[r]+' '+scaleNames[i],kind:'alternate',root:r,notes:scaleNotes[i]});
    }
    if(alternatives.length)entries.push({label:'Also matches',kind:'section'});
    return entries.concat(alternatives);
}
function followselect(v) {
    follow=Number(v)?1:0;sourceKind=follow?'Live':'Local';sourceSet='';sourceDevice='';sourceLabel='';
    if(follow){
        if(apiReady)useLive();
        else {root=activeRoot;name=activeName;notes=active.slice(0);}
    }
    if(sourceKind==='Local')name=activeName=recognizedName(notes);
    render();save();
}
function blackselect(v) { black=Number(v)===1?1:0;render();save(); }
function toggle(pc) {
    pc=Number(pc);if(pc<0||pc>11||pc!==Math.floor(pc))return;
    var interval=(pc-root+12)%12;
    if(interval===0)return; // Root is an invariant, not a removable degree.
    if(sourceKind!=='Local')return;name='Custom';var idx=notes.indexOf(interval);
    if(idx>=0)notes.splice(idx,1);else{notes.push(interval);notes.sort(function(a,b){return a-b;});}
    changed();
}
function audition(pc) { pc=Number(pc);if(pc>=0&&pc<12)outlet(0,'audition',60+pc); }
function render() {
menuEntries=scaleMenu();var menuIndex=0,labels=[];
    for(var i=0;i<menuEntries.length;i++){labels.push(menuEntries[i].label);if(menuEntries[i].label===name)menuIndex=i;}
    var signature=labels.join('|');
    var sm=ui('scale_menu');if(sm && menuSignature!==signature){menuSignature=signature;sm.message('clear');for(i=0;i<labels.length;i++)sm.message('append',labels[i]);}
    setui('root_menu',root);setui('scale_menu',menuIndex);setui('source_menu',sourceKind==='Live'?1:(sourceKind==='WhiteKeys'?2:0));setui('host_toggle',hostEnabled);setui('black_menu',black);
    setui('scale_title','WhiteKeys');
    var visibleName=activeName.length>28?activeName.slice(0,25)+'...':activeName;
    var text='Playing: '+pitchNames[activeRoot]+' '+visibleName+' ('+active.length+(active.length===1?' note)':' notes)');
    var sourceText=sourceKind==='Local'?'Local':(sourceKind==='WhiteKeys'?(sourceAvailable?'Following '+sourceLabel:(sourceDevice?'Source unavailable':'Select a Host')):(apiReady?'Following Live':'Live unavailable'));
    if(follow&&apiReady&&!liveMode)sourceText+=' - Scale Mode off';
    setui('source_status',sharingNotice||sourceText);
    var status=ui('status_label');if(status){status.message('set',text);status.message('textcolor',184/255,197/255,186/255,1);}
    var editable=sourceKind==='Local'?0:1;
    var controls=['root_menu','scale_menu'];
    for(var j=0;j<controls.length;j++){var control=ui(controls[j]);if(control)control.message('ignoreclick',editable);}
    var sourceMenu=ui('source_menu'),sourceLabels=['Local','Follow Live','Follow WhiteKeys'];for(i=0;i<directory.length;i++)sourceLabels.push(directory[i].label);
    var sourceSignature=sourceLabels.join('|');if(sourceMenu&&sourceMenuSignature!==sourceSignature){sourceMenuSignature=sourceSignature;sourceMenu.message('clear');for(i=0;i<sourceLabels.length;i++)sourceMenu.message('append',sourceLabels[i]);}
    setui('source_menu',sourceKind==='Live'?1:(sourceKind==='WhiteKeys'?2:0));
    var hostControl=ui('host_toggle');if(hostControl)hostControl.message('ignoreclick',sourceKind==='WhiteKeys'?1:0);
    if(identityBlocked)setui('source_status','Identity conflict');else if(currentSet&&setIdentity!==currentSet)setui('source_status','Source unavailable - different Set');
    outlet(2,'sharingstate',JSON.stringify({record:getvalueof(),valid:recordValid?1:0}));
    outlet(1,['view',root,mask(notes)]);
    outlet(0,'blackkeys',black);
    outlet(0,['configure',activeRoot].concat(active));
}
