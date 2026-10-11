"""Regression for the Max parameter seam proven by the real Live A/B/C probe.
This checks serialized configuration, not a simulated Live round trip.
"""
import json
from pathlib import Path

patch = json.loads(Path(__file__).with_name('WhiteKeys Live 12.maxpat').read_text())['patcher']
store = next(entry['box'] for entry in patch['boxes'] if entry['box']['id'] == 'store')
assert store.get('saved_object_attributes', {}).get('parameter_enable') == 1, 'Max needs saved parameter_enable to load blob metadata instead of Float'
attrs = store['saved_attribute_attributes']['valueof']
assert attrs['parameter_type'] == 3, 'Scale state must be a list/blob'
assert attrs['parameter_invisible'] == 1, 'Stored Only persists; Hidden does not persist in a Live Set'
assert 'store' in patch['parameters'], 'State parameter must be registered with Live'
print('Persistence configuration regression OK (real Live round trip remains a separate check)')
