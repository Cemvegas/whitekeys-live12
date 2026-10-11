// Contract for an external coordinator. Native mapping itself is not simulated proof.
const assert=require('node:assert/strict');
const {createLedger}=require('./ownership-ledger.cjs');
let next=0;
function fixture(){
 const references=new Map([['original-ref',11]]);
 const ledger=createLedger({setUid:'set-A',entries:[{uid:'original',reference:'original-ref'}]},
  {freshUid:()=>`fresh-${++next}`,resolve:ref=>references.get(ref)||0});
 return {ledger,references};
}
for(const order of [[12,11],[11,12]]){
 const {ledger}=fixture();const results=new Map();
 for(const runtime of order)results.set(runtime,ledger.claim({runtime,saved:{setUid:'set-A',uid:'original',host:true}}));
 assert.deepEqual(results.get(11),{status:'owned',uid:'original',host:true});
 assert.notEqual(results.get(12).uid,'original');assert.equal(results.get(12).host,false);
}
{
 const {ledger,references}=fixture();references.set('original-ref',27);
 assert.deepEqual(ledger.claim({runtime:27,saved:{setUid:'set-A',uid:'original',host:true}}),{status:'owned',uid:'original',host:true});
 const copy=ledger.claim({runtime:28,saved:{setUid:'set-A',uid:'original',host:true}});
 assert.equal(copy.host,false);assert.notEqual(copy.uid,'original');
}
{
 const {ledger}=fixture();
 const copy=ledger.claim({runtime:11,saved:{setUid:'set-B',uid:'original',host:true}});
 assert.equal(copy.host,false);assert.notEqual(copy.uid,'original');
}
{
 const {ledger,references}=fixture();references.set('original-ref',0);
 assert.deepEqual(ledger.claim({runtime:12,saved:{setUid:'set-A',uid:'original',host:true}}),{status:'pending'});
 references.set('original-ref',11);
 assert.deepEqual(ledger.claim({runtime:11,saved:{setUid:'set-A',uid:'original',host:true}}),{status:'owned',uid:'original',host:true});
}
{
 const {ledger}=fixture();
 assert.deepEqual(ledger.claim({runtime:11,saved:{setUid:'set-A',uid:'missing',host:true}}),{status:'pending'});
 assert.throws(()=>ledger.claim({runtime:0,saved:{setUid:'set-A',uid:'original',host:true}}));
}
console.log('External ownership ledger contracts passed; native adapter and Live acceptance NOT implemented.');
