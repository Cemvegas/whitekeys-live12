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
import shutil
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
JS = {'whitekeys-api.js', 'whitekeys-midi.js', 'whitekeys-state.js', 'whitekeys-keyboard.js', 'whitekeys-sharing.js'}
REQUIRED = JS | {'WhiteKeys Live 12.maxpat', 'WhiteKeys Live 12.amxd',
                 'test-midi.cjs', 'test-state.cjs', 'test-sharing.cjs', 'test-sharing-adapter.cjs', 'test-sharing-performance.cjs', 'test-auto-identity.cjs', 'sharing-test-fixture.cjs', 'test-ui.cjs', 'test-persistence.py', 'build-amxd.py',
                 'package-development.py', 'check.py', 'test-packaging.py', 'PROJECT-LAYOUT.md', 'AGENTS.md', 'KURULUM-VE-TEST.md', 'HOST-SONUC-FORMU.md',
                 'docs/production-sharing.md', 'docs/specs/automatic-identity-resolution.md', 'docs/automatic-identity-review.md', 'docs/production-sharing-review.md',
                 'docs/performance-diagnosis/README.md'}


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
    if len(deps) != 5 or {d['name'] for d in deps} != JS or any(d.get('bootpath') != '.' or d.get('patcherrelativepath') != '.' or d.get('type') != 'TEXT' for d in deps):
        raise ValueError('Five adjacent JS dependencies required')
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
              (('panicmsg', 0), ('midi', 0)), (('host', 0), ('hostprep', 0)),
              (('hostprep', 0), ('model', 0)), (('init', 0), ('sharing', 0)),
              (('model', 2), ('sharing', 0)), (('anchor', 0), ('anchorprep', 0)),
              (('anchorprep', 0), ('sharing', 0))}
    for control in ('root', 'scale', 'black', 'source'):
        needed |= {((control, 0), (control + 'prep', 0)), ((control + 'prep', 0), ('model', 0))}
    if not needed <= routes:
        raise ValueError('Missing MIDI/API/editor/panic route')
    if boxes.get('source',{}).get('varname') != 'source_menu' or boxes.get('host',{}).get('varname') != 'host_toggle':
        raise ValueError('Scale Source and gated Host controls required')
    if boxes['host'].get('maxclass') != 'textbutton' or boxes['host'].get('mode') != 1 or boxes['host'].get('ignoreclick') != 0 or boxes['host'].get('usebgoncolor') != 1:
        raise ValueError('Native Host textbutton must be clickable')
    if boxes.get('anchor', {}).get('saved_object_attributes', {}).get('_persistence') != 1:
        raise ValueError('Persistent native Set anchor missing')
    if p['parameters'].get('enrollment', [None])[0] != 'WhiteKeys sharing enrollment':
        raise ValueError('Native census enrollment marker missing')
    if boxes['enrollment']['saved_attribute_attributes']['valueof']['parameter_invisible'] != 0:
        raise ValueError('Enrollment must be automatable to appear in Device.parameters')
    if any(name in boxes for name in ('apply', 'applymsg', 'mode', 'modeprep', 'modestatus', 'modelabel')):
        raise ValueError('Removed Mode or Apply controls remain')
    if p.get('openrect') != [0, 0, 360, 169]:
        raise ValueError('Expected 360 by 169 Live device panel')
    for box in boxes.values():
        if box.get('presentation'):
            x, y, width, height = box['presentation_rect']
            if min(x, y) < 0 or min(width, height) <= 0 or x + width > 360 or y + height > 169:
                raise ValueError('Presentation control outside panel: ' + box['id'])
    if boxes['keyboard']['presentation_rect'][2:] != [332, 62]:
        raise ValueError('Scale Keyboard must retain 332 by 62 size')
    if boxes['store']['text'] != 'pattr scale_state @bindto model @parameter_enable 1' or boxes['model'].get('varname') != 'model':
        raise ValueError('Invalid per-device pattr binding')
    attrs = boxes['store']['saved_attribute_attributes']['valueof']
    if boxes['store'].get('saved_object_attributes', {}).get('parameter_enable') != 1 or attrs['parameter_type'] != 3 or attrs['parameter_invisible'] != 1 or 'store' not in p['parameters']:
        raise ValueError('Enabled Stored Only blob parameter missing')
    print('Integrity OK: AMXD JSON equals maxpat; five local JS; routing; Stored Only per-device blob')


def package(output):
    if git('status', '--porcelain', '--untracked-files=all', '--', *sorted(REQUIRED)):
        raise ValueError('Commit production source changes before packaging')
    commit = git('rev-parse', 'HEAD')
    files = sorted(git('ls-files').splitlines())
    if not REQUIRED <= set(files):
        raise ValueError('Required source files must be tracked')
    if output.resolve().is_relative_to(ROOT):
        raise ValueError('ZIP must be outside the source checkout (use chat outputs)')
    # Bundle committed production files; preserve unrelated in-progress diagnostics.
    data = {name: subprocess.check_output(['git', '-C', str(ROOT), 'show', 'HEAD:' + name]) for name in sorted(REQUIRED)}
    manifest = {'status': 'PARTIAL DEVELOPMENT — Live acceptance pending issue #22; production sharing implemented; production Live acceptance pending',
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


def publish_current():
    """Publish one current installation; retain the previous one in the workspace archive."""
    workspace = ROOT.parent
    current = workspace / 'current'
    staging = workspace / '.current-staging'
    if staging.exists():
        raise ValueError('Unfinished publication at ' + str(staging))
    staging.mkdir(parents=True)
    archived_previous = None
    try:
        output = staging / 'WhiteKeysLive12-development.zip'
        package(output)
        with zipfile.ZipFile(output) as bundle:
            manifest = json.loads(bundle.read('WhiteKeysLive12/MANIFEST.json'))
            install = staging
            for name in sorted(JS | {'WhiteKeys Live 12.amxd'}):
                (install / name).write_bytes(bundle.read('WhiteKeysLive12/' + name))
        manifest['package'] = 'WhiteKeysLive12-development.zip'
        manifest['installation'] = 'WhiteKeys Live 12.amxd'
        manifest['package_sha256'] = hashlib.sha256(output.read_bytes()).hexdigest()
        (staging / 'MANIFEST.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        if current.exists():
            previous = json.loads((current / 'MANIFEST.json').read_text())
            stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
            destination = workspace / 'archive' / ('package-' + previous['source_commit'][:12] + '-' + stamp)
            destination.parent.mkdir(parents=True, exist_ok=True)
            current.rename(destination)
            archived_previous = destination
        staging.rename(current)
        print('Current installation:', current)
    except Exception:
        if archived_previous is not None and not current.exists():
            archived_previous.rename(current)
        if staging.exists():
            shutil.rmtree(staging)
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--output', type=Path)
    parser.add_argument('--current', action='store_true', help='Publish current/ and archive its previous contents')
    args = parser.parse_args()
    if args.current and args.output:
        parser.error('Choose --current or --output')
    if not args.check and args.output is None and not args.current:
        parser.error('Use --check or --output /absolute/chat/outputs/package.zip')
    integrity()
    if args.output:
        package(args.output)
    if args.current:
        publish_current()
