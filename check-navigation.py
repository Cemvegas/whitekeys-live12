"""Validate portable navigation targets, domain snapshots and ZIP dependencies."""
import hashlib
import importlib.util
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
DOCUMENTS = ('AGENTS.md', 'PROJECT-LAYOUT.md', 'docs/navigation.md',
             'docs/agents/domain.md', 'docs/agents/issue-tracker.md',
             'docs/agents/triage-labels.md', 'KURULUM-VE-TEST.md',
             'docs/production-sharing.md', 'docs/specs/automatic-identity-resolution.md')


def validate(root, packaged):
    errors = []
    manifest_path = root / 'docs/domain-snapshot.json'
    if not manifest_path.is_file():
        return ['Missing docs/domain-snapshot.json']
    snapshots = json.loads(manifest_path.read_text())['files']
    required = set(DOCUMENTS) | set(snapshots) | {'docs/domain-snapshot.json',
                                               'check-navigation.py', 'test-navigation.py'}
    for name in sorted(required):
        if not (root / name).is_file():
            errors.append('Missing ' + name)
        if name not in packaged:
            errors.append('Not included in development ZIP: ' + name)
    # Original workspace is identified by its named checkout and authority marker.
    workspace = root.parent
    authority = root.name == 'WhiteKeysLive12' and (workspace / 'AGENTS.md').is_file() and (workspace / 'docs/agents/domain.md').is_file()
    for name, expected in snapshots.items():
        path = root / name
        if path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            errors.append('Snapshot hash differs: ' + name)
        original = workspace / name
        if authority and (not original.is_file() or not path.is_file() or original.read_bytes() != path.read_bytes()):
            errors.append('Workspace authority differs: ' + name)
    if authority:
        authoritative_names = {'GLOSSARY.md'} | {str(p.relative_to(workspace)) for p in (workspace / 'docs/adr').glob('*.md')}
        if authoritative_names != set(snapshots):
            errors.append('Domain snapshot inventory differs from workspace authority')
    for name in DOCUMENTS:
        path = root / name
        if not path.is_file():
            continue
        for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)', path.read_text()):
            target = target.strip('<>')
            url = urlsplit(target)
            if url.scheme or not url.path:
                continue
            resolved = (path.parent / unquote(url.path)).resolve()
            if not resolved.is_relative_to(root.resolve()) or not resolved.is_file():
                errors.append(f'Broken or external source target: {name} -> {target}')
            elif resolved.relative_to(root.resolve()).as_posix() not in packaged:
                errors.append(f'Linked target absent from ZIP: {name} -> {target}')
    return errors


def main():
    spec = importlib.util.spec_from_file_location('packaging', ROOT / 'package-development.py')
    packaging = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(packaging)
    errors = validate(ROOT, packaging.REQUIRED)
    if errors:
        raise SystemExit('\n'.join(errors))
    print('Portable navigation and domain snapshots passed.')


if __name__ == '__main__':
    main()
