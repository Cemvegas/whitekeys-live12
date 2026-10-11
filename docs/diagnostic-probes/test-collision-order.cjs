// Candidate diagnostic: runtime owner continuity is assumed, not proven by this VM.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const shared={},source=fs.readFileSync(path.resolve(__dirname,'sharing-owner/sharing-prototype.js'),'utf8');
function device(token,runtime){const c={Global:function(){return shared},arrayfromargs:a=>Array.from(a),outlet(){},notifyclients(){},LiveAPI:function(){this.get=()=>['device']}};Object.assign(c,require('./deterministic-clock.cjs').globals());vm.createContext(c);vm.runInContext(source,c);c.token=token;c.runtime=runtime;c.scope='set-1';c.renderUI=()=>{};c.setvalueof(2,'wk-original',1,'',0,11,0,2,4,5,7,9,11);c.resolveIdentity(runtime);return c;}
const original=device('original',11),copy=device('copy',12);
copy.tick();original.tick();
console.log(JSON.stringify({original:Array.from(original.getvalueof()).slice(0,3),copy:Array.from(copy.getvalueof()).slice(0,3)}));
assert.equal(original.uid,'wk-original','Original must retain identity when copy registers first');
assert.equal(original.hosting,1,'Original Host must remain ON');
assert.notEqual(copy.uid,'wk-original','Copy must receive a fresh identity');
assert.equal(copy.hosting,0,'Copy must start Host OFF');
