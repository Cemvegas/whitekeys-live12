// THROWAWAY coordinator contract; not a Max/Live adapter or production transport.
exports.createLedger=function(record,ports){
 const owners=new Map(record.entries.map(e=>[e.uid,e.reference]));
 return {claim({runtime,saved}){
  if(!Number.isSafeInteger(runtime)||runtime<=0)throw new TypeError('Live object is not ready');
  if(saved.setUid===record.setUid){
   const reference=owners.get(saved.uid);
   // Missing/unresolved mapping is absence of evidence, not evidence of a copy.
   if(!reference)return {status:'pending'};
   const mappedOwner=ports.resolve(reference);
   if(!Number.isSafeInteger(mappedOwner)||mappedOwner<=0)return {status:'pending'};
   // Resolve now: never compare against a cached runtime integer from initialization.
   if(mappedOwner===runtime)return {status:'owned',uid:saved.uid,host:saved.host};
  }
  const uid=ports.freshUid();
  if(typeof uid!=='string'||!uid||owners.has(uid))throw new Error('Fresh UID is invalid or collides');
  return {status:'new',uid,host:false};
 }};
};
