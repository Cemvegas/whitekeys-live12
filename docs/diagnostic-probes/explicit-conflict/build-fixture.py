"""Build a standalone diagnostic AMXD; no production source is modified."""
import json,struct,shutil
from pathlib import Path
here=Path(__file__).resolve().parent
source=here.parent/'live-fixtures/master/Identity Master Fixture.maxpat'
d=json.loads(source.read_text());p=d['patcher']
p['devicewidth']=680;p['openrect']=[0,0,680,169]
p['boxes']=[e for e in p['boxes'] if e['box']['id'] not in ['identity_anchor','device_out','debug0','debug1','debug2','debug3']]
p['lines']=[e for e in p['lines'] if e['patchline']['source'][0] not in ['identity_anchor','device_out','debug0','debug1','debug2','debug3','mi']]
for e in p['boxes']:
 b=e['box']
 if b['id']=='model':b['text']='js explicit-conflict.js';b['numoutlets']=2;b['outlettype']=['','']
 if b['id']=='title':b['text']='WHITEKEYS #19 · CONFLICT PROBE'
 if b['id']=='status':b['presentation_rect']=[365,8,305,155];b['fontsize']=9
 if b['id']=='scale_status':b['presentation']=0
 if b['id']=='connection':b['presentation_rect']=[12,75,340,38]
 if b['id']=='store':
  b['text']='pattr conflict_probe_state @bindto model @parameter_enable 1'
  a=b['saved_attribute_attributes']['valueof'];a['parameter_type']=3;a['parameter_invisible']=1
  a['parameter_longname']='Conflict Probe State';a['parameter_shortname']='Conflict State'
p['parameters']={'store':['Conflict Probe State','Conflict State',0]}
p['boxes'] += [
 {'box':{'id':'midi','maxclass':'newobj','text':'js probe-midi.js','patching_rect':[10,680,150,22]}},
 {'box':{'id':'choice','varname':'choice_menu','maxclass':'umenu','items':['Choose device to keep identity'],'patching_rect':[10,720,330,22],'presentation':1,'presentation_rect':[12,120,280,22]}},
 {'box':{'id':'choicecmd','maxclass':'newobj','text':'prepend choose','patching_rect':[350,720,100,22]}},
 {'box':{'id':'refresh','maxclass':'message','text':'refresh','patching_rect':[10,750,50,22],'presentation':1,'presentation_rect':[298,120,55,22]}},
 {'box':{'id':'panic','maxclass':'message','text':'panic','patching_rect':[80,750,50,22],'presentation':1,'presentation_rect':[298,145,55,20]}}]
for src,out,dst,inp in [('mi',0,'midi',0),('midi',0,'mo',0),('model',1,'midi',0),('choice',0,'choicecmd',0),('choicecmd',0,'model',0),('refresh',0,'model',0),('panic',0,'midi',0)]:p['lines'].append({'patchline':{'source':[src,out],'destination':[dst,inp]}})
raw=(json.dumps(d,indent=2)+'\n').encode();(here/'Explicit Conflict Probe.maxpat').write_bytes(raw)
payload=raw+b'\0';amxd=b'ampf'+struct.pack('<I',4)+b'mmmm'+b'meta'+struct.pack('<II',4,0)+b'ptch'+struct.pack('<I',len(payload))+payload
(here/'Explicit Conflict Probe.amxd').write_bytes(amxd)
# Distributable folder keeps the JS beside the AMXD. No Live process is launched.
workspace=here.parents[2];out=workspace/'outputs/explicit-conflict-probe-2026-10-11';out.mkdir(parents=True,exist_ok=True)
for name in ['Explicit Conflict Probe.amxd','Explicit Conflict Probe.maxpat','explicit-conflict.js','probe-midi.js','README.md']:
 shutil.copy2(here/name,out/name)
print(out)
