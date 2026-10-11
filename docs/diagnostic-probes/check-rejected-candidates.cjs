// Diagnostic runner: succeeds only if the recorded defects are reproduced.
// A successful invocation means the candidates remain REJECTED, not that #19 passes.
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const checks=[
 ['test-collision-baseline.cjs',1,'Original must retain identity when copy registers first'],
 ['test-collision-order.cjs',0,null],
 ['test-runtime-reuse.cjs',1,'A copy in another Set must receive a new UID'],
 ['test-runtime-change.cjs',1,'The original must retain its UID after runtime IDs change']
];
for(const [file,expected,signal] of checks){
 const r=spawnSync(process.execPath,[path.join(__dirname,file)],{encoding:'utf8'});
 const output=r.stdout+r.stderr;
 if(r.status!==expected||(signal&&!output.includes(signal)))throw new Error(file+' produced an unexpected verdict\n'+output);
 console.log(file+': '+(expected?'expected RED reproduced':'limited GREEN reproduced'));
}
console.log('#19: NOT ACCEPTED; production sharing remains disabled.');
