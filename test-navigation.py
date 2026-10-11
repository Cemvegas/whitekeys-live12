"""Portable navigation checks through their command-line interface."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import shutil

ROOT = Path(__file__).resolve().parent


class NavigationTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.clone = Path(self.directory.name) / 'source'
        shutil.copytree(ROOT, self.clone, ignore=shutil.ignore_patterns('.git', '__pycache__', 'WhiteKeysLive12', 'archive', 'current', 'outputs', 'work'))

    def run_check(self):
        return subprocess.run([sys.executable, str(self.clone / 'check-navigation.py')],
                              cwd=self.directory.name, capture_output=True, text=True)

    def assert_failure(self, message):
        result = self.run_check()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(message, result.stdout + result.stderr)

    def test_standalone_source_needs_no_parent_workspace(self):
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_required_target_fails(self):
        (self.clone / 'docs/navigation.md').unlink()
        self.assert_failure('Missing docs/navigation.md')

    def test_broken_link_fails(self):
        with (self.clone / 'AGENTS.md').open('a') as doc:
            doc.write('\n[Missing guide](docs/missing.md)\n')
        self.assert_failure('Broken or external source target')

    def test_parent_dependency_fails_in_standalone_source(self):
        with (self.clone / 'AGENTS.md').open('a') as doc:
            doc.write('\n[Workspace](../PROJECT-LAYOUT.md)\n')
        self.assert_failure('Broken or external source target')

    def test_required_document_omitted_from_zip_fails(self):
        package = self.clone / 'package-development.py'
        package.write_text(package.read_text() + "\nREQUIRED.discard('docs/navigation.md')\n")
        self.assert_failure('Not included in development ZIP: docs/navigation.md')

    def test_domain_document_can_be_updated_in_single_root(self):
        with (self.clone / 'GLOSSARY.md').open('a') as doc:
            doc.write('\nUnrecorded domain change\n')
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == '__main__':
    unittest.main()
