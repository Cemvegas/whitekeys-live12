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
var menuSignature = '', preferredMode = 1;
var apiReady = false, apiError = '';
function mask(a) { var n=0; for(var i=0;i<a.length;i++) n |= 1<<a[i]; return n; }
function unmask(m) { var a=[]; for(var i=0;i<12;i++) if(m & (1<<i)) a.push(i); return a; }
function valid(a) { if(!a.length||a[0]!==0) return false; for(var i=0;i<a.length;i++) if(a[i]!==Math.floor(a[i])||a[i]<0||a[i]>11||(i&&a[i]<=a[i-1]))return false; return true; }
function getvalueof() { return [3,follow,root,name,mask(draft),activeRoot,activeName,mask(active),black,preferredMode]; }
function setvalueof() {
    var a=arrayfromargs(arguments); if(a.length===1&&a[0] instanceof Array)a=a[0];
    var old=Number(a[0])===2&&a.length===9;
    if(!old&&(Number(a[0])!==3||a.length!==10||(Number(a[9])!==0&&Number(a[9])!==1))) return;
    var dm=Number(a[4]),am=Number(a[7]);
    if(dm<1||dm>4095||dm!==Math.floor(dm)||am<1||am>4095||am!==Math.floor(am))return;
    var r=Number(a[2]),ar=Number(a[5]),d=unmask(dm),v=unmask(am);
    if(r<0||r>11||r!==Math.floor(r)||ar<0||ar>11||ar!==Math.floor(ar)||!valid(d)||!valid(v)||(old&&v.length!==7))return;
    preferredMode=old?0:Number(a[9]);
    follow=Number(a[1])?1:0;root=r;name=String(a[3]);draft=d;activeRoot=ar;activeName=String(a[6]);active=v;black=Number(a[8])===1?1:0;
    // A ready API wins over a stale Follow blob, even before the init message.
    if(follow&&apiReady) useLive();
    render();
}
function init() { if(follow&&apiReady)useLive();render(); }
function ui(id) { return this.patcher.getnamed(id); }
function setui(id,value) { var b=ui(id); if(b) b.message('set',value); }
function save() { notifyclients(); }
function apply() { if(follow)return;active=draft.slice(0);activeRoot=root;activeName=name;render();save(); }
function useLive() { root=liveRoot;name=liveName;draft=liveNotes.slice(0);active=draft.slice(0);activeRoot=root;activeName=name; }
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
    follow=0;root=v;render();save();
}
function scaleselect(v) {
    v=Number(v);if(v<0||v>=scaleNames.length||v!==Math.floor(v))return;
    follow=0;name=scaleNames[v];
    if(v<scaleNotes.length)draft=scaleNotes[v].slice(0);
    else if(name!=='Custom'&&name===liveName)draft=liveNotes.slice(0);
    render();save();
}
function followselect(v) {
    follow=Number(v)?1:0;
    if(follow){
        if(apiReady)useLive();
        else {root=activeRoot;name=activeName;draft=active.slice(0);}
    }
    render();save();
}
function modeselect(v) { v=Number(v);if(v!==0&&v!==1)return;preferredMode=v;render();save(); }
function blackselect(v) { black=Number(v)===1?1:0;render();save(); }
function toggle(pc) {
    pc=Number(pc);if(pc<0||pc>11||pc!==Math.floor(pc))return;
    var interval=(pc-root+12)%12;
    if(interval===0)return; // Root is an invariant, not a removable degree.
    follow=0;name='Custom';var idx=draft.indexOf(interval);
    if(idx>=0)draft.splice(idx,1);else{draft.push(interval);draft.sort(function(a,b){return a-b;});}
    render();save();
}
function audition(pc) { pc=Number(pc);if(pc>=0&&pc<12)outlet(0,'audition',60+pc); }
function render() {
    var menuIndex=scaleNames.indexOf(name);
    if(menuIndex<0){scaleNames.push(name);menuIndex=scaleNames.length-1;}
    var signature=scaleNames.join('|');
    var sm=ui('scale_menu');if(sm && menuSignature!==signature){menuSignature=signature;sm.message('clear');for(var i=0;i<scaleNames.length;i++)sm.message('append',scaleNames[i]);}
    setui('root_menu',root);setui('scale_menu',menuIndex);setui('follow_toggle',follow);setui('black_menu',black);
    setui('scale_title','Draft: '+pitchNames[root]+' '+name+' ('+draft.length+(draft.length===1?' note)':' notes)'));
    setui('mode_menu',preferredMode);
    var effective = preferredMode===0 && active.length===7 ? 'Octave Anchored' : 'Continuous Degrees';
    setui('mode_status',effective+(preferredMode===0&&active.length!==7?': '+active.length+(active.length===1?' note':' notes')+'; Anchored needs 7':''));
    var text='Playing: '+pitchNames[activeRoot]+' '+activeName+' ('+active.length+(active.length===1?' note)':' notes)');
    if(follow&&!apiReady)text='Live unavailable';
    if(follow&&apiReady&&!liveMode)text+=' - Scale Mode off';
    var status=ui('status_label');if(status){status.message('set',text);status.message('textcolor',0.36,0.44,0.27,1);}
    var button=ui('apply_button');if(button)button.message('ignoreclick',follow?1:0);
    outlet(1,['view',root,mask(draft)]);
    outlet(0,'blackkeys',black);
    if(follow&&!apiReady)outlet(0,'unavailable');
    else outlet(0,['configure',activeRoot].concat(active));
}
