// ES5 model. LiveAPI is isolated in whitekeys-api.js; persisted through a blob pattr.
autowatch = 0;
inlets = 1;
outlets = 2;
var pitchNames = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
var scaleNames = ['Major','Minor','Dorian','Mixolydian','Lydian','Phrygian','Locrian','Harmonic Minor','Melodic Minor','Major Pentatonic','Minor Pentatonic','Whole Tone','Custom'];
var scaleNotes = [[0,2,4,5,7,9,11],[0,2,3,5,7,8,10],[0,2,3,5,7,9,10],[0,2,4,5,7,9,10],[0,2,4,6,7,9,11],[0,1,3,5,7,8,10],[0,1,3,5,6,8,10],[0,2,3,5,7,8,11],[0,2,3,5,7,9,11],[0,2,4,7,9],[0,3,5,7,10],[0,2,4,6,8,10]];
var follow = 1, root = 0, name = 'Major', draft = scaleNotes[0].slice(0);
var activeRoot = 0, activeName = 'Major', active = draft.slice(0), black = 0;
var liveRoot = 0, liveName = 'Major', liveNotes = draft.slice(0), liveMode = 1;
var menuSignature = '';
var apiReady = false, apiError = '', initialized = false;
function mask(a) { var n=0; for(var i=0;i<a.length;i++) n |= 1<<a[i]; return n; }
function unmask(m) { var a=[]; for(var i=0;i<12;i++) if(m & (1<<i)) a.push(i); return a; }
function valid(a) { if(!a.length||a[0]!==0) return false; for(var i=0;i<a.length;i++) if(a[i]!==Math.floor(a[i])||a[i]<0||a[i]>11||(i&&a[i]<=a[i-1]))return false; return true; }
function getvalueof() { return [2,follow,root,name,mask(draft),activeRoot,activeName,mask(active),black]; }
function setvalueof() {
    var a=arrayfromargs(arguments); if(a.length===1&&a[0] instanceof Array)a=a[0];
    if(a.length!==9||Number(a[0])!==2) return;
    var r=Number(a[2]),ar=Number(a[5]),d=unmask(Number(a[4])),v=unmask(Number(a[7]));
    if(r<0||r>11||r!==Math.floor(r)||ar<0||ar>11||ar!==Math.floor(ar)||!valid(d)||!valid(v)||v.length!==7)return;
    follow=Number(a[1])?1:0;root=r;name=String(a[3]);draft=d;activeRoot=ar;activeName=String(a[6]);active=v;black=Number(a[8])===1?1:0;
    // Live's blob may arrive after API init. Follow mode must always use fresh Live values.
    if(initialized&&follow&&apiReady) useLive();
    render();
}
function init() { initialized=true; if(follow&&apiReady)useLive();render(); }
function ui(id) { return this.patcher.getnamed(id); }
function setui(id,value) { var b=ui(id); if(b) b.message('set',value); }
function save() { notifyclients(); }
function adopt() { if(draft.length===7){active=draft.slice(0);activeRoot=root;activeName=name;} }
function useLive() { root=liveRoot;name=liveName;draft=liveNotes.slice(0);adopt(); }
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
    follow=0;root=v;adopt();render();save();
}
function scaleselect(v) {
    v=Number(v);if(v<0||v>=scaleNames.length||v!==Math.floor(v))return;
    follow=0;name=scaleNames[v];
    if(v<scaleNotes.length)draft=scaleNotes[v].slice(0);
    else if(name!=='Custom'&&name===liveName)draft=liveNotes.slice(0);
    adopt();render();save();
}
function followselect(v) { follow=Number(v)?1:0; if(follow&&apiReady)useLive();render();save(); }
function blackselect(v) { black=Number(v)===1?1:0;render();save(); }
function toggle(pc) {
    pc=Number(pc);if(pc<0||pc>11||pc!==Math.floor(pc))return;
    var interval=(pc-root+12)%12;
    if(interval===0)return; // Root is an invariant, not a removable degree.
    follow=0;name='Custom';var idx=draft.indexOf(interval);
    if(idx>=0)draft.splice(idx,1);else{draft.push(interval);draft.sort(function(a,b){return a-b;});}
    adopt();render();save();
}
function audition(pc) { pc=Number(pc);if(pc>=0&&pc<12)outlet(0,'audition',60+pc); }
function render() {
    var menuIndex=scaleNames.indexOf(name);
    if(menuIndex<0){scaleNames.push(name);menuIndex=scaleNames.length-1;}
    var signature=scaleNames.join('|');
    var sm=ui('scale_menu');if(sm && menuSignature!==signature){menuSignature=signature;sm.message('clear');for(var i=0;i<scaleNames.length;i++)sm.message('append',scaleNames[i]);}
    setui('root_menu',root);setui('scale_menu',menuIndex);setui('follow_toggle',follow);setui('black_menu',black);
    setui('scale_title',pitchNames[root]+' '+name);
    var text=draft.length+'/7 notes';
    if(follow&&!apiReady)text='Live unavailable';
    else if(draft.length!==7)text+=follow?' - choose 7 notes':' - playing '+pitchNames[activeRoot]+' '+activeName;
    else if(follow&&!liveMode)text+=' - Scale Mode off';
    var status=ui('status_label');if(status){status.message('set',text);status.message('textcolor',draft.length===7?0.36:0.65,draft.length===7?0.44:0.36,draft.length===7?0.27:0.13,1);}
    outlet(1,['view',root,mask(draft)]);
    outlet(0,'blackkeys',black);
    if(follow&&(!apiReady||draft.length!==7))outlet(0,'unavailable');
    else outlet(0,['configure',activeRoot].concat(active));
}
