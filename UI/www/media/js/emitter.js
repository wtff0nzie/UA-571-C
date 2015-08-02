// Node style event emitter
(function () {
    var evts = {},
        HP = HTMLElement.prototype;


    if (HP.addTrigger || HP.trigger) {
        return;
    }

    // Add a trigger listener
    HP.addTrigger = function (evtType, fnc) {
        var D = this;

        evtType.split(' ').forEach(function (ev) {
            if (! evts[D]) {
                evts[D] = {};
            }

            if (! evts[D][ev]) {
                evts[D][ev] = [];
            }

            evts[D][ev].push(fnc);

            D.addEventListener(ev, function (e) {
                D.trigger(ev, e);
            }, false);
        });

        return D;
    };

    // Remove a specific trigger or all triggers for an event
    HP.removeTrigger = function (evtType, fnc) {
        var D = this,
            elEvents;

        if (! evts[D] || ! evts[D][evtType]) {
            return D;
        }

        elEvents =  evts[D][evtType];

        elEvents.forEach(function (evt, index) {
            if (evt === fnc) {
                elEvents.splice(index, 1);
            }
        });

        return D;
    };

    // Manually trigger an event
    HP.trigger = function (evs, data) {
        var D = this;

        if (! evts[D]) {
            return D
        }

        evs.split(' ').forEach(function (ev) {
            if (! evts[D][ev]) {
                return;
            }

            evts[D][ev].forEach(function (fnc) {
                fnc.call(D, data);
            });
        });

        return D;
    };
    HP.triggerEvent = HP.trigger;
} ());