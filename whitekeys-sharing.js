// Native transport adapter. Every operation runs on Max's deferred scheduler.
// Runtime IDs locate devices only; live incumbents are retained; cold collisions use native Set order.
autowatch=0;inlets=1;outlets=1;
var nativeApis={}, nativeSeen={}, parameterNames={}, lastMessages={};
var bus=new Global('whitekeys_production_sharing_v1');
var runtime='',scope='',session='',anchor=-1,master=0,record=null,validRecord=0,label='',poll=null;
var transportEpoch='',lastResolution='',topology=[],nativeReady=false,revision=0,snapshotKey='',foreign=false,roleGeneration='';
function uid(){return 'wk-'+new Date().getTime().toString(36)+'-'+Math.floor(Math.random()*4294967296).toString(36)+'-'+Math.floor(Math.random()*4294967296).toString(36);}
function read(){try{return JSON.parse(bus.data||'{}');}catch(e){return {};}}
function write(table){bus.data=JSON.stringify(table);}
function model(){return this.patcher.getnamed('model');}
function send(){
    var a=arrayfromargs(arguments),command=a[0];
    var cacheable=command==='sharingrole'||command==='sharingcontext'||command==='sharingdirectory'||command==='sharingstatus';
    var signature=cacheable?JSON.stringify(a):'';if(cacheable&&lastMessages[command]===signature)return;
    if(command==='sharingdirectory')delete lastMessages.sharingstatus;
    model().message.apply(model(),a);if(cacheable)lastMessages[command]=signature;
}

function sharingstate(json){var s;try{s=JSON.parse(String(json));}catch(e){return;}record=s.record;validRecord=s.valid===1?1:0;if(!validRecord)lastMessages={};}
function nativeanchor(){var a=arrayfromargs(arguments);if(a[0]!=='id'||!runtime)return;anchor=Number(a[1])||0;
    foreign=!!record&&record[2]!=='unresolved'&&anchor!==master;
    nativeReady=!foreign;if(nativeReady)this.patcher.getnamed('song_anchor').message('id',master);
    if(foreign)send('sharingstatus','Source unavailable - different Set');
}
function ids(values){var out=[];for(var i=0;i<values.length;i++)if(values[i]==='id'&&Number(values[i+1]))out.push(String(values[++i]));return out;}
function pathApi(path){
    nativeSeen[path]=1;var cached=nativeApis[path];
    if(cached&&Number(cached.id))return cached;
    var handle=new LiveAPI(null,path);nativeApis[path]=handle;return handle;
}
function api(id){var path='id '+id,handle=nativeApis[path];nativeSeen[path]=1;if(handle&&Number(handle.id)===Number(id))return handle;if(handle){try{handle.id=0;}catch(e){}delete nativeApis[path];}return pathApi(path);}
function parameterName(id){var handle=api(id),key='id '+id,cached=parameterNames[key];if(cached&&cached.handle===handle)return cached.name;var name=handle.get('name').join(' ');parameterNames[key]={handle:handle,name:name};return name;}
function pruneNativeApis(){for(var path in nativeApis)if(path.indexOf('id ')===0&&!nativeSeen[path]){try{nativeApis[path].id=0;}catch(e){}delete nativeApis[path];delete parameterNames[path];}}


function scanContainer(container,found){
    var devices=ids(container.get('devices'));
    for(var i=0;i<devices.length;i++){
        var d=api(devices[i]),params=ids(d.get('parameters')),enrolled=false;
        for(var j=0;j<params.length;j++){var name=parameterName(params[j]);if(name==='WK enrollment'||name==='WhiteKeys sharing enrollment')enrolled=true;}
        if(enrolled)found.push(devices[i]);
        if(Number(d.get('can_have_chains')[0])){var chains=ids(d.get('chains'));for(j=0;j<chains.length;j++)scanContainer(api(chains[j]),found);}
    }
}
function census(song){var found=[],tracks=ids(song.get('tracks')).concat(ids(song.get('return_tracks')));for(var i=0;i<tracks.length;i++)scanContainer(api(tracks[i]),found);scanContainer(pathApi('live_set master_track'),found);return found;}
function location(d){
    var names=[d.get('name').join(' ')],parent=ids(d.get('canonical_parent')),seen={},hops=0;
    while(parent.length&&parent[0]!==scope.split(':')[0]&&hops++<24&&!seen[parent[0]]){seen[parent[0]]=1;var p=api(parent[0]);try{names.unshift(p.get('name').join(' '));}catch(e){}parent=ids(p.get('canonical_parent'));}
    return names[0];
}
function init(){
    dispose();session=uid();transportEpoch=uid();lastResolution='';poll=new Task(tick,this);
    try{
        var song=pathApi('live_set'),d=pathApi('this_device'),masterApi=pathApi('live_set master_track mixer_device volume');master=Number(masterApi.id);anchor=-1;
        if(!Number(song.id)||!Number(d.id)||!master)throw new Error('Live not ready');
        runtime=String(d.id);scope=String(song.id)+':'+String(master);label=location(d);
        // Ask restored live.object first; never overwrite a saved foreign anchor.
        this.patcher.getnamed('song_anchor').message('getid');
        tick();poll.interval=100;poll.repeat();
    }catch(e){nativeReady=false;outlet(0,'apistatus','Sharing API unavailable');poll.schedule(1000);}
}
function group(entries,id){var out=[];for(var key in entries)if(entries.hasOwnProperty(key)&&!entries[key].excluded&&entries[key].record[1]===id)out.push(entries[key]);return out.sort(function(a,b){return a.runtime<b.runtime?-1:(a.runtime>b.runtime?1:0);});}
function signature(g){var a=[];for(var i=0;i<g.length;i++)a.push(g[i].record[1]+':'+g[i].runtime+':'+g[i].session+':'+g[i].epoch);return a.join('|');}
// Explicit actions alone authorize a role transfer. Discovery never chooses a winner.
function sharinghost(actionSession,sequence,enabled){
    sequence=Number(sequence);enabled=Number(enabled);
    if(sequence<1||sequence!==Math.floor(sequence)||sequence>9007199254740991||(enabled!==0&&enabled!==1))return;
    var table=read(),s=table[scope];if(!s||!nativeReady||foreign||actionSession!==session||!validRecord||!record)return;
    var own=group(s.entries,record[1]),source=record[6]?group(s.entries,record[6]):[];
    if(own.length!==1||record[12]===1||source.length>1||source.some(function(e){return e.record[12]===1;}))return;
    var live=census(pathApi('live_set'));for(var i=0;i<live.length;i++)if(!s.entries[live[i]])return;
    s.actions=s.actions||{};if(Number(sequence)<= (s.actions[session]||0))return;s.actions[session]=Number(sequence);
    if(Number(enabled)===1)s.role={runtime:runtime,session:session,generation:uid()};
    else if(s.role&&s.role.runtime===runtime&&s.role.session===session)s.role={runtime:'',session:''};
    else if(!s.role&&record[4]===1)s.role={runtime:'',session:''};
    write(table);tick();
}
function applyRole(s){
    if(s.role){
        if(identityProtectsRole(s))return;
        if(record[12]===1||group(s.entries,record[1]).length>1)return;
        var target=s.entries[s.role.runtime];
        if(!target||target.session!==s.role.session||(s.role.runtime===runtime&&record[3]==='WhiteKeys'))s.role={runtime:'',session:''};
        var enabled=s.role.runtime===runtime&&s.role.session===session?1:0;
        if(enabled&&roleGeneration!==s.role.generation){roleGeneration=s.role.generation;transportEpoch=uid();revision=0;snapshotKey='';s.entries[runtime].epoch=transportEpoch;s.entries[runtime].revision=revision;}
        if(record[4]!==enabled){send('sharingrole',enabled,0);s.entries[runtime].record=record;}
    }
}
// A known incumbent is meaningful only within this live native session.
// At cold startup, native Set traversal order is the user's chosen fallback.
function automaticIdentity(s){
    s.owners=s.owners||{};
    var visited={};
    for(var r in s.entries){
        var e=s.entries[r];if(e.excluded||visited[e.record[1]])continue;
        var id=e.record[1],g=group(s.entries,id);visited[id]=1;
        var busy=false,k,i;for(i=0;i<g.length;i++)if(identityTransaction(s,g[i].runtime))busy=true;
        if(busy)continue;
        if(g.length===1&&g[0].valid&&g[0].record[12]!==1){s.owners[id]={runtime:g[0].runtime,session:g[0].session};continue;}
        var ready=g.length>0;for(i=0;i<g.length;i++)if(!g[i].valid||g[i].record[12]!==1)ready=false;
        if(!ready)continue;
        var owner=s.owners[id],keeper=null;
        for(i=0;i<g.length;i++)if(owner&&g[i].runtime===owner.runtime&&g[i].session===owner.session)keeper=g[i];
        if(!keeper)for(i=0;i<topology.length&&!keeper;i++)for(k=0;k<g.length;k++)if(g[k].runtime===topology[i])keeper=g[k];
        if(keeper){var table=read();table[scope]=s;write(table);resolveIdentity(scope+'#'+signature(g),keeper.runtime);return;}
    }
    var table=read();table[scope]=s;write(table);
}
function resolveIdentity(sig,keeper){
    // Re-read native topology and shared state at the moment of choice.
    var table=read(),s=table[scope];if(!s||!nativeReady)return;
    var entry=s.entries[String(keeper)];if(!entry)return;
    var g=group(s.entries,entry.record[1]);if(!g.length||(g.length===1&&g[0].record[12]!==1)||String(sig)!==scope+'#'+signature(g))return;
    var live=census(pathApi('live_set'));if(live.join('|')!==topology.join('|'))return;
    var k,i;for(i=0;i<g.length;i++)if(identityTransaction(s,g[i].runtime))return;
    var tx={assignments:{},sessions:{},original:{},topology:live.join('|')};var allocated={};for(k in s.entries)allocated[s.entries[k].record[1]]=1;
    for(i=0;i<g.length;i++){if(g[i].record[12]!==1)return;var id=g[i].record[1];if(g[i].runtime!==String(keeper)){do{id=uid();}while(allocated[id]);allocated[id]=1;}tx.assignments[g[i].runtime]={id:id,host:g[i].runtime===String(keeper)?g[i].record[4]:0};tx.sessions[g[i].runtime]=g[i].session;tx.original[g[i].runtime]={id:g[i].record[1],host:g[i].record[4]};}
    if(s.role&&g.some(function(e){return e.runtime===s.role.runtime&&e.session===s.role.session;})){tx.roleBefore=JSON.parse(JSON.stringify(s.role));s.role.runtime=String(keeper);s.role.session=entry.session;}
    s.transactions[String(sig)]=tx;write(table);
}
// Identity transaction membership is shared by allocation, role protection and directory publication.
function identityTransaction(s,member){
    for(var key in s.transactions)if(s.transactions[key].assignments[member])return key;
    return '';
}
function identityProtectsRole(s){
    for(var key in s.transactions){var before=s.transactions[key].roleBefore;if(before&&s.role&&before.generation===s.role.generation)return true;}
    return false;
}
// Advance only this device's assignment; model feedback updates record synchronously.
// Return null while rolling back, so no directory or snapshot can escape that poll.
function advanceIdentity(table,s){
    // Mark ALL claimants blocked before exposing any source directory.
    var own=group(s.entries,record[1]);if(own.length>1&&record[12]!==1){send('sharingblocked',1);s.entries[runtime].record=record;write(table);}
    var t=identityTransaction(s,runtime),tx=t?s.transactions[t]:null,r;
    if(tx){
        var intact=true;for(r in tx.assignments){var e=s.entries[r];if(!e||!e.valid||e.session!==tx.sessions[r])intact=false;}
        // A changed native membership aborts before any sharing can resume.
        if(!intact||topology.join('|')!==tx.topology)tx.cancelled=1;
        if(tx.cancelled){
            var old=tx.original[runtime];send('sharingblocked',1);if(record[1]!==old.id||record[4]!==old.host){send('sharingidentity',old.id,old.host);s.entries[runtime].record=record;}
            var rolledBack=true;for(r in tx.original)if(s.entries[r]&&(s.entries[r].record[1]!==tx.original[r].id||s.entries[r].record[4]!==tx.original[r].host))rolledBack=false;
            if(rolledBack){if(tx.roleBefore&&s.role&&s.role.generation===tx.roleBefore.generation)s.role=tx.roleBefore;delete s.transactions[t];}write(table);send('sharingdirectory','[]');return null;
        }
        var a=tx.assignments[runtime];if(record[1]!==a.id||record[4]!==a.host){send('sharingidentity',a.id,a.host);s.entries[runtime].record=record;write(table);}
        var applied=true;for(r in tx.assignments)if(s.entries[r].record[1]!==tx.assignments[r].id||s.entries[r].record[4]!==tx.assignments[r].host)applied=false;
        if(applied){tx.committed=1;if(lastResolution!==t){lastResolution=t;transportEpoch=uid();revision=0;snapshotKey='';s.entries[runtime].epoch=transportEpoch;s.entries[runtime].revision=revision;}write(table);send('sharingblocked',0);s.entries[runtime].record=record;write(table);}
        var cleared=applied;for(r in tx.assignments)if(s.entries[r].record[12]===1)cleared=false;
        if(cleared){delete s.transactions[t];write(table);}
    }
    return own;
}

function tick(){
    try{
        nativeSeen={};
        if(!runtime){init();return;}
        var song=pathApi('live_set');if(!Number(song.id)||scope.split(':')[0]!==String(song.id))throw new Error('Set changed');
        label=location(api(runtime));
        topology=census(song);pruneNativeApis();if(!record||anchor<0)return;var table=read(),s=table[scope];
        if(!s){s={set:foreign?'':(record&&record[2]!=='unresolved'?record[2]:uid()),entries:{},transactions:{}};table[scope]=s;}
        if(!s.set&&!foreign)s.set=record[2]!=='unresolved'?record[2]:uid();
        if(foreign||(record[2]!=='unresolved'&&record[2]!==s.set)){
            s.entries[runtime]={runtime:runtime,session:session,record:record,valid:0,label:label,excluded:1};write(table);
            send('sharingdirectory','[]');send('sharingstatus','Source unavailable - different Set');return;
        }
        if(!nativeReady)return;
        send('sharingcontext',s.set,session,runtime);
        // Registration barrier: every native enrolled device must be registered.
        // Identity allocation separately requires valid collision members.
        // A missing peer is pending, never proof that this device owns a copied UID.
        var key=record[8]+'|'+record[9]+'|'+record[10]+'|'+record[4]+'|'+record[3];if(key!==snapshotKey){snapshotKey=key;revision++;}
        s.entries[runtime]={runtime:runtime,session:session,record:record,valid:validRecord,label:label,revision:revision,epoch:transportEpoch};
        for(var r in s.entries)if(topology.indexOf(r)<0)delete s.entries[r];
        var ready=topology.indexOf(runtime)>=0;
        for(var i=0;i<topology.length;i++)if(!s.entries[topology[i]])ready=false;
        write(table);
        if(!ready){send('sharingdirectory','[]');return;}
        applyRole(s);write(table);
        var own=advanceIdentity(table,s);if(!own)return;
        var peers=[],selected=null,hosts=[];
        for(r in s.entries){var candidate=s.entries[r];if(!candidate.excluded&&candidate.valid&&candidate.record[4]===1&&candidate.record[3]!=='WhiteKeys'&&candidate.record[12]!==1&&group(s.entries,candidate.record[1]).length===1)hosts.push(candidate);}
        var roleConflict=hosts.length>1;
        for(r in s.entries){var entry=s.entries[r];if(entry.excluded)continue;var v=entry.record,g=group(s.entries,v[1]),blocked=v[12]===1||g.length>1||!entry.valid;
            if(identityTransaction(s,r))blocked=true;
            var activeHost=!roleConflict&&v[4]===1&&!blocked;
            var p={id:v[1],set:s.set,session:entry.epoch,host:activeHost?1:0,kind:v[3],blocked:blocked?1:0,label:entry.label,transfer:s.role&&s.role.generation?s.role.generation:''};peers.push(p);
            if(activeHost&&v[3]!=='WhiteKeys')selected=entry;
        }
        send('sharingrole',record[4],!roleConflict&&record[4]===1&&record[12]!==1&&own.length===1&&validRecord?1:0);
        send('sharingdirectory',JSON.stringify(peers));
        if(roleConflict)send('sharingstatus','Host conflict');
        var sourceGroup=record[6]?group(s.entries,record[6]):[];if(sourceGroup.length>1||sourceGroup.some(function(e){return e.record[12]===1;}))send('sharingstatus','Identity conflict');
        if(selected)send('sharingsnapshot',JSON.stringify({set:s.set,id:selected.record[1],session:selected.epoch,revision:selected.revision,root:selected.record[8],mask:selected.record[9],name:selected.record[10]}));

        automaticIdentity(s);
    }catch(e){send('sharingdirectory','[]');post('WhiteKeys sharing unavailable: '+e.message+'\n');}
}
function dispose(){for(var path in nativeApis){try{nativeApis[path].id=0;}catch(e){}}nativeApis={};nativeSeen={};parameterNames={};lastMessages={};if(poll){poll.cancel();poll=null;}if(scope&&runtime){var table=read();if(table[scope]){delete table[scope].entries[runtime];if(!Object.keys(table[scope].entries).length)delete table[scope];write(table);}}runtime='';nativeReady=false;}
function notifydeleted(){dispose();}
