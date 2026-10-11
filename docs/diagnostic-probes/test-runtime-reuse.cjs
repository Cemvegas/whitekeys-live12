// Regression contract from Live: runtime 1 was reused by a copy in a different Set.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'sharing-owner/sharing-prototype.js'),'utf8');
const c={Global:function(){return {}},arrayfromargs:a=>Array.from(a),outlet(){},notifyclients(){},LiveAPI:function(){this.get=()=>['device']}};
Object.assign(c,require('./deterministic-clock.cjs').globals());vm.createContext(c);vm.runInContext(source,c);
c.scope='different-set';c.runtime=1;c.setvalueof(2,'wk-original',1,'',0,1,0,2,3,4,6,7,9,10);c.resolveIdentity(1);
console.log(JSON.stringify({runtime:c.runtime,uid:c.uid,host:c.hosting}));
assert.notEqual(c.uid,'wk-original','A copy in another Set must receive a new UID even when the runtime integer is reused');
assert.equal(c.hosting,0,'A copy in another Set must start Host OFF');
