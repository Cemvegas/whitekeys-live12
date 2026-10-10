"""Kaynak maxpat'i dondurulmamis Max MIDI Effect kabina paketle.
Python 3; ek paket gerekmez. .js dosyalarini cihazin yaninda tut.
"""
import json
import struct
from pathlib import Path

folder = Path(__file__).resolve().parent
source = folder / "WhiteKeys Live 12.maxpat"
patch = json.loads(source.read_text(encoding="utf-8"))
assert patch["patcher"]["project"]["amxdtype"] == 1835887981
payload = (json.dumps(patch, ensure_ascii=False, indent=2) + "\n\0").encode("utf-8")
header = b"ampf" + struct.pack("<I", 4) + b"mmmm"
header += b"meta" + struct.pack("<II", 4, 0)
header += b"ptch" + struct.pack("<I", len(payload))
target = folder / "WhiteKeys Live 12.amxd"
target.write_bytes(header + payload)
print(target.name, len(header + payload), "bytes")
