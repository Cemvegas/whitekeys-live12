"""Read-only native performance loop; does not open/modify/restart Live.
Run while the affected AMXD is loaded. Raw sample stays in temporary storage.
"""
import argparse, json, re, subprocess, tempfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--pid',type=int);p.add_argument('--sample-file',type=Path);p.add_argument('--check',action='store_true');a=p.parse_args()
if a.sample_file:
    raw=a.sample_file.read_text()
else:
    if not a.pid:p.error('Use --pid or --sample-file')
    with tempfile.TemporaryDirectory(prefix='whitekeys-profile-') as d:
        f=Path(d)/'sample.txt'
        subprocess.run(['sample',str(a.pid),'2','-file',str(f)],check=True,stdout=subprocess.DEVNULL)
        raw=f.read_text()
main=re.search(r'^\s*(\d+) Thread_.*com.apple.main-thread',raw,re.M)
# The constructor can occur at several sibling callgraph nodes; sum those samples.
constructors=sum(map(int,re.findall(r'[^\n]*?\b(\d+) jsliveapi_constructor\(',raw[:raw.find('Binary Images:')])) )
total=int(main.group(1));fraction=constructors/total
print(json.dumps({'main_thread_samples':total,'LiveAPI_constructor_samples':constructors,'constructor_fraction':round(fraction,3),'verdict':'FAIL: native construction monopolizes Live UI' if fraction>0.25 else 'PASS: constructor storm absent'},ensure_ascii=False))
if a.check and fraction>0.25:raise SystemExit(1)
