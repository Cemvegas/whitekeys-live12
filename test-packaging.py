"""Publication regression checks isolated from the real installation."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

spec = importlib.util.spec_from_file_location('packaging', Path(__file__).with_name('package-development.py'))
packaging = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packaging)

class PublicationTests(unittest.TestCase):
    def test_failed_promotion_restores_previous_installation(self):
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            source = workspace / 'source'
            source.mkdir()
            current = workspace / 'current'
            current.mkdir()
            previous = json.dumps({'source_commit': 'old-commit'})
            (current / 'MANIFEST.json').write_text(previous)
            (current / 'device.amxd').write_bytes(b'previous installation')
            original_rename = Path.rename
            def rename(path, target):
                if path.name == '.current-staging':
                    raise OSError('simulated promotion failure')
                return original_rename(path, target)
            def package(output):
                with zipfile.ZipFile(output, 'w') as bundle:
                    bundle.writestr('WhiteKeysLive12/MANIFEST.json', json.dumps({'source_commit': 'new-commit'}))
                    for name in packaging.JS | {'WhiteKeys Live 12.amxd'}:
                        bundle.writestr('WhiteKeysLive12/' + name, b'new content')
            with patch.object(packaging, 'ROOT', source), patch.object(packaging, 'package', package), patch.object(Path, 'rename', rename):
                with self.assertRaisesRegex(OSError, 'simulated promotion failure'):
                    packaging.publish_current()
            self.assertTrue(current.is_dir())
            self.assertEqual((current / 'device.amxd').read_bytes(), b'previous installation')
            self.assertEqual((current / 'MANIFEST.json').read_text(), previous)
            self.assertFalse((workspace / '.current-staging').exists())
            self.assertEqual(list((workspace / 'archive').iterdir()), [])

if __name__ == '__main__':
    unittest.main()
