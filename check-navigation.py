"""Validate portable navigation targets, domain documents and ZIP dependencies."""
import importlib.util
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
    required = set(DOCUMENTS) | {'GLOSSARY.md', 'check-navigation.py', 'test-navigation.py'}
    required |= {p.relative_to(root).as_posix() for p in (root / 'docs/adr').glob('*.md')}
    for name in sorted(required):
        if not (root / name).is_file():
            errors.append('Missing ' + name)
        if name not in packaged:
            errors.append('Not included in development ZIP: ' + name)
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
    print('Portable navigation and domain documents passed.')


if __name__ == '__main__':
    main()
