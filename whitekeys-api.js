// API side only: triggered after live.thisdevice -> deferlow.
autowatch = 0;
inlets = 1;
outlets = 2;
var song = null, observers = [], refreshTask = null, retryTask = null;
var names = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
function changed(args) {
    if (!args || args[0] === 'id') return;
    if (refreshTask) { refreshTask.cancel(); refreshTask.schedule(0); }
}
function init() {
    dispose();
    refreshTask = new Task(refresh, this);
    retryTask = new Task(init, this);
    try {
        song = new LiveAPI(null, 'live_set');
        if (!Number(song.id)) throw new Error('live_set not available');
        var props = ['root_note','scale_intervals','scale_name','scale_mode'];
        for (var i = 0; i < props.length; i++) {
            var obs = new LiveAPI(changed, 'live_set');
            observers.push(obs); obs.property = props[i];
        }
        refresh();
    } catch (e) {
        outlet(0, 'apistatus', 'Live API unavailable');
        outlet(1, 'set', 'Waiting for Live API: ' + e.message);
        retryTask.schedule(1000);
    }
}
function refresh() {
    try {
        var r = Number(song.get('root_note')[0]);
        var iv = song.get('scale_intervals');
        var name = song.get('scale_name').join(' ');
        var mode = Number(song.get('scale_mode')[0]);
        outlet(0, ['livescale', r, name, mode].concat(iv));
        post('WhiteKeys API: root=' + r + ' intervals=' + iv.join(',') + ' scale=' + name + '\n');
    } catch (e) {
        outlet(0, 'apistatus', 'Live API unavailable'); outlet(1, 'set', 'Live API error: ' + e.message);
        if (retryTask) retryTask.schedule(1000);
    }
}
function dispose() {
    if (refreshTask) refreshTask.cancel();
    if (retryTask) retryTask.cancel();
    for (var i = 0; i < observers.length; i++) { try { observers[i].property = ''; observers[i].id = 0; } catch (e) {} }
    observers = []; song = null;
}
function notifydeleted() { dispose(); }
