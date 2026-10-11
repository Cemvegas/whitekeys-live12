"""Run the production checks from any working directory: python3 check.py."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
commands = [['node', '--check', str(path.name)] for path in sorted(ROOT.glob('whitekeys-*.js'))]
commands += [['node', name] for name in (
    'test-midi.cjs', 'test-state.cjs', 'test-ui.cjs', 'test-sharing.cjs',
    'test-sharing-adapter.cjs', 'test-auto-identity.cjs', 'test-sharing-performance.cjs')]
commands += [[sys.executable, 'test-persistence.py'],
             [sys.executable, 'package-development.py', '--check'],
             ['git', 'diff', '--check']]
for command in commands:
    print('Running:', ' '.join(command), flush=True)
    subprocess.run(command, cwd=ROOT, check=True)
print('All production checks passed.')
