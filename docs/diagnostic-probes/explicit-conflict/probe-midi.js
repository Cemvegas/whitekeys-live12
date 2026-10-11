// Max js (ECMAScript 5). Raw MIDI stream in/out; no LiveAPI on MIDI path.
autowatch = 0;
inlets = 1;
outlets = 2;
var auditionTasks = [], channelEpoch = {};
var root = 0, intervals = [], ready = false, black = 0;
var pending = {}, counts = {}, status = 0, data = [], sysex = false;
var white = {0:0, 2:1, 4:2, 5:3, 7:4, 9:5, 11:6};
function configureIntervals() {
    var a = arrayfromargs(arguments), r = Number(a.shift()), ok = a.length >= 1 && a.length <= 12;
    for (var i = 0; i < a.length; i++) {
        a[i] = Number(a[i]);
        if (a[i] !== Math.floor(a[i]) || a[i] < 0 || a[i] > 11 || (i && a[i] <= a[i-1])) ok = false;
    }
    ready = ok && a[0] === 0 && r >= 0 && r <= 11 && r === Math.floor(r);
    root = r; intervals = a;
}
function unavailable() { ready = false; }
function blackkeys(v) { black = Number(v) === 1 ? 1 : 0; }
function send(a) {
    for (var i = 0; i < a.length; i++) outlet(0, a[i]);
    var type = a[0] & 240;
    if (a.length === 3 && (type === 128 || type === 144)) outlet(1, ['playing'].concat(a));
}
function mapped(n) {
    var degree = white[n % 12];
    if (degree === undefined) return black ? -1 : n;
    if (!ready) return -1;
    var step = (Math.floor(n / 12) - 5) * 7 + degree;
    var octave = Math.floor(step / intervals.length);
    var index = step - octave * intervals.length;
    var out = 60 + root + octave * 12 + intervals[index];
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
    channelEpoch[ch] = (channelEpoch[ch] || 0) + 1;
    outlet(1, "clearvoice", ch);
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
    if (b >= 248) { send([b]); if (b === 255) { stopAuditions(); outlet(1, "clear"); pending = {}; counts = {}; status = 0; data = []; sysex = false; } return; }
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
function stopAuditions() {
    // Invalidate even callbacks already queued by Max before cancellation.
    channelEpoch[0] = (channelEpoch[0] || 0) + 1;
    for (var i = 0; i < auditionTasks.length; i++) auditionTasks[i].cancel();
    auditionTasks = [];
}
function audition(n) {
    n = Number(n); if (n < 0 || n > 127 || n !== Math.floor(n)) return;
    var target = '0:' + n, epoch = channelEpoch[0] || 0;
    counts[target] = (counts[target] || 0) + 1;
    send([144, n, 96]);
    var task = new Task(function () {
        if (epoch === (channelEpoch[0] || 0) && counts[target]) {
            counts[target]--;
            if (counts[target] === 0) { delete counts[target]; send([128, n, 0]); }
        }
        var idx = auditionTasks.indexOf(task); if (idx >= 0) auditionTasks.splice(idx, 1);
    }, this);
    auditionTasks.push(task); task.schedule(240);
}
function notifydeleted() { stopAuditions(); }
function panic() {
    stopAuditions(); outlet(1, "clear");
    var k, a;
    for (k in counts) { a = k.split(':'); send([128 + Number(a[0]), Number(a[1]), 0]); }
    for (var ch = 0; ch < 16; ch++) { send([176 + ch, 64, 0]); send([176 + ch, 123, 0]); }
    pending = {}; counts = {}; status = 0; data = []; sysex = false;
}

// Diagnostic mask adapter; mapper above is a frozen copy of production MIDI.
function configure(r,m){var args=[Number(r)];for(var i=0;i<12;i++)if(Number(m)&(1<<i))args.push(i);configureIntervals.apply(this,args);}
