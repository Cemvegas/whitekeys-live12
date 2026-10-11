// Requirement regression, not a claim that this renumbering was observed in Live.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'sharing-owner/sharing-prototype.js'),'utf8');
const c={Global:function(){return {}},arrayfromargs:a=>Array.from(a),outlet(){},notifyclients(){},LiveAPI:function(){this.get=()=>['device']}};
Object.assign(c,require('./deterministic-clock.cjs').globals());vm.createContext(c);vm.runInContext(source,c);
c.scope='same-set';c.runtime=27;
c.setvalueof(2,'wk-original',1,'',0,11,0,2,4,5,7,9,11);
c.resolveIdentity(27);
assert.equal(c.uid,'wk-original','The original must retain its UID after runtime IDs change');
assert.equal(c.hosting,1,'The original must retain Host ON after runtime IDs change');
