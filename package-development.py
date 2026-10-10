"""Reproducible development ZIP; Python 3.9+ standard library, no host interaction.
Commit the source first. --check validates the editable patch and AMXD in place.
"""
import argparse
import hashlib
import json
from pathlib import Path
import struct
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parent
JS = {'whitekeys-api.js', 'whitekeys-midi.js', 'whitekeys-state.js', 'whitekeys-keyboard.js'}
REQUIRED = JS | {'WhiteKeys Live 12.maxpat', 'WhiteKeys Live 12.amxd',
                 'test-midi.cjs', 'test-state.cjs', 'build-amxd.py',
                 'package-development.py', 'KURULUM-VE-TEST.md', 'HOST-SONUC-FORMU.md'}


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args]).decode().strip()


def integrity():
    for name in REQUIRED:
        if not (ROOT / name).is_file():
            raise ValueError('Missing dependency/source: ' + name)
    patch = json.loads((ROOT / 'WhiteKeys Live 12.maxpat').read_text())
    amxd = (ROOT / 'WhiteKeys Live 12.amxd').read_bytes()
    if len(amxd) < 33 or amxd[:28] != (b'ampf' + struct.pack('<I', 4) + b'mmmmmeta' + struct.pack('<II', 4, 0) + b'ptch'):
        raise ValueError('Invalid AMXD container header')
    if struct.unpack('<I', amxd[28:32])[0] != len(amxd) - 32 or amxd[-1:] != b'\0':
        raise ValueError('Invalid AMXD payload length/terminator')
    if json.loads(amxd[32:-1]) != patch:
        raise ValueError('AMXD payload differs from editable maxpat; run build-amxd.py')
    p = patch['patcher']
    if p['project']['amxdtype'] != 1835887981:
        raise ValueError('Not a MIDI effect')
    deps = p['dependency_cache']
    if len(deps) != 4 or {d['name'] for d in deps} != JS or any(d.get('bootpath') != '.' or d.get('patcherrelativepath') != '.' or d.get('type') != 'TEXT' for d in deps):
        raise ValueError('Four adjacent JS dependencies required')
    boxes = {b['box']['id']: b['box'] for b in p['boxes']}
    scripts = {b.get('text', '').removeprefix('js ') for b in boxes.values() if b.get('text', '').startswith('js ')}
    scripts |= {b['filename'] for b in boxes.values() if b.get('maxclass') == 'jsui'}
    if scripts != JS:
        raise ValueError('Patch JS references differ from dependencies')
    routes = {(tuple(l['patchline']['source']), tuple(l['patchline']['destination'])) for l in p['lines']}
    needed = {(('in', 0), ('midi', 0)), (('midi', 0), ('out', 0)),
              (('this', 0), ('defer', 0)), (('defer', 0), ('init', 0)),
              (('init', 0), ('api', 0)), (('init', 0), ('model', 0)),
              (('api', 0), ('model', 0)), (('model', 0), ('midi', 0)),
              (('keyboard', 0), ('model', 0)), (('model', 1), ('keyboard', 0)),
              (('midi', 1), ('keyboard', 0)), (('panic', 0), ('panicmsg', 0)),
              (('panicmsg', 0), ('midi', 0))}
    for control in ('root', 'scale', 'black', 'follow', 'mode'):
        needed |= {((control, 0), (control + 'prep', 0)), ((control + 'prep', 0), ('model', 0))}
    needed |= {(("apply", 0), ("applymsg", 0)), (("applymsg", 0), ("model", 0))}
    if not needed <= routes:
        raise ValueError('Missing MIDI/API/editor/mode/Apply/panic route')
    if boxes['applymsg']['text'] != 'apply' or boxes['apply'].get('varname') != 'apply_button':
        raise ValueError('Invalid Apply control')
    if p.get('openrect') != [0, 0, 360, 205]:
        raise ValueError('Expected 360 by 205 device panel')
    for box in boxes.values():
        if box.get('presentation'):
            x, y, width, height = box['presentation_rect']
            if min(x, y) < 0 or min(width, height) <= 0 or x + width > 360 or y + height > 205:
                raise ValueError('Presentation control outside panel: ' + box['id'])
    if boxes['keyboard']['presentation_rect'][2:] != [332, 62]:
        raise ValueError('Scale Keyboard must retain 332 by 62 size')
    if [item for item in boxes['mode']['items'] if item != ','] != ['Octave Anchored', 'Continuous Degrees']:
        raise ValueError('Mapping Mode choices missing')
    if boxes['store']['text'] != 'pattr scale_state @bindto model @parameter_enable 1' or boxes['model'].get('varname') != 'model':
        raise ValueError('Invalid per-device pattr binding')
    attrs = boxes['store']['saved_attribute_attributes']['valueof']
    if attrs['parameter_type'] != 3 or attrs['parameter_invisible'] != 2 or 'store' not in p['parameters']:
        raise ValueError('Hidden blob parameter missing')
    print('Integrity OK: AMXD JSON equals maxpat; four local JS; routing; hidden per-device blob')


def package(output):
    if git('status', '--porcelain', '--untracked-files=all'):
        raise ValueError('Commit all source changes before packaging')
    commit = git('rev-parse', 'HEAD')
    files = sorted(git('ls-files').splitlines())
    if not REQUIRED <= set(files):
        raise ValueError('Required source files must be tracked')
    if output.resolve().is_relative_to(ROOT):
        raise ValueError('ZIP must be outside the source checkout (use chat outputs)')
    data = {name: (ROOT / name).read_bytes() for name in files}
    manifest = {'status': 'DEVELOPMENT — host acceptance pending issue #15',
                'source_commit': commit, 'package_version': 'development-' + commit[:12],
                'files': {name: {'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest()} for name, content in data.items()}}
    data['MANIFEST.json'] = (json.dumps(manifest, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode()
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_STORED) as archive:
        for name, content in sorted(data.items()):
            entry = zipfile.ZipInfo('WhiteKeysLive12/' + name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise ValueError('ZIP CRC verification failed')
        for name, content in data.items():
            if archive.read('WhiteKeysLive12/' + name) != content:
                raise ValueError('ZIP bytes differ: ' + name)
    print(str(output), 'source', commit, 'sha256', hashlib.sha256(output.read_bytes()).hexdigest())


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    if not args.check and args.output is None:
        parser.error('Use --check or --output /absolute/chat/outputs/package.zip')
    integrity()
    if args.output:
        package(args.output)
