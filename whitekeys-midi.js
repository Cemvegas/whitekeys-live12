// Max js (ECMAScript 5). Raw MIDI stream in/out; no LiveAPI on MIDI path.
autowatch = 0;
inlets = 1;
outlets = 1;
var root = 0, intervals = [], ready = false, black = 0;
var pending = {}, counts = {}, status = 0, data = [], sysex = false;
var white = {0:0, 2:1, 4:2, 5:3, 7:4, 9:5, 11:6};
function configure() {
    var a = arrayfromargs(arguments), r = Number(a.shift()), ok = a.length === 7;
    for (var i = 0; i < a.length; i++) {
        a[i] = Number(a[i]);
        if (a[i] !== Math.floor(a[i]) || a[i] < 0 || a[i] > 11 || (i && a[i] <= a[i-1])) ok = false;
    }
    ready = ok && a[0] === 0 && r >= 0 && r <= 11 && r === Math.floor(r);
    root = r; intervals = a;
}
function unavailable() { ready = false; }
function blackkeys(v) { black = Number(v) === 1 ? 1 : 0; }
function send(a) { for (var i = 0; i < a.length; i++) outlet(0, a[i]); }
function mapped(n) {
    var degree = white[n % 12];
    if (degree === undefined) return black ? -1 : n;
    if (!ready) return -1;
    var out = Math.floor(n / 12) * 12 + root + intervals[degree];
    return out > 127 || out < 0 ? -1 : out;
}
function note(s, n, v) {
    var ch = s & 15, key = ch + ':' + n, out, target;
    if ((s & 240) === 144 && v > 0) {
        out = mapped(n);
        if (!pending[key]) pending[key] = [];
        pending[key].push(out);
        if (out < 0) return;
        target = ch + ':' + out;
        counts[target] = (counts[target] || 0) + 1;
        send([s, out, v]); // Every note-on retains its velocity, including retriggers.
    } else {
        if (!pending[key] || !pending[key].length) return;
        out = pending[key].shift();
        if (!pending[key].length) delete pending[key];
        if (out < 0) return;
        target = ch + ':' + out;
        counts[target]--;
        // Colliding passthrough/mapped voices close only after the final key release.
        if (counts[target] <= 0) { delete counts[target]; send([s, out, v]); }
    }
}
function clearChannel(ch) {
    var k;
    for (k in pending) if (k.split(':')[0] === String(ch)) delete pending[k];
    for (k in counts) if (k.split(':')[0] === String(ch)) delete counts[k];
}
function message(s, d) {
    var type = s & 240;
    if (s < 240 && (type === 128 || type === 144)) note(s, d[0], d[1]);
    else if (s < 240 && type === 160) {
        var q = pending[(s & 15) + ':' + d[0]], seen = {};
        if (q) for (var i = 0; i < q.length; i++) if (q[i] >= 0 && !seen[q[i]]) {
            send([s, q[i], d[1]]); seen[q[i]] = true;
        }
    } else {
        send([s].concat(d));
        if (type === 176 && (d[0] === 120 || d[0] === 123 || d[0] >= 124)) clearChannel(s & 15);
    }
}
function msg_int(b) {
    b = Number(b);
    if (b < 0 || b > 255 || b !== Math.floor(b)) return;
    if (b >= 248) { send([b]); if (b === 255) { pending = {}; counts = {}; status = 0; data = []; sysex = false; } return; }
    if (sysex) {
        if (b < 128 || b === 247) { send([b]); if (b === 247) sysex = false; return; }
        sysex = false;
    }
    if (b >= 128) {
        data = []; status = b;
        if (b === 240) { sysex = true; status = 0; send([b]); }
        else if (b === 246 || b === 247 || b === 244 || b === 245) { send([b]); status = 0; }
        return;
    }
    if (!status) return;
    data.push(b);
    var len = status < 240 ? (((status & 240) === 192 || (status & 240) === 208) ? 1 : 2) : (status === 242 ? 2 : 1);
    if (data.length === len) { message(status, data); data = []; if (status >= 240) status = 0; }
}
function panic() {
    var k, a;
    for (k in counts) { a = k.split(':'); send([128 + Number(a[0]), Number(a[1]), 0]); }
    for (var ch = 0; ch < 16; ch++) { send([176 + ch, 64, 0]); send([176 + ch, 123, 0]); }
    pending = {}; counts = {}; status = 0; data = []; sysex = false;
}
