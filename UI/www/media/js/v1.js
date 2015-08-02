;(function (undefined) {
    var doc = document,
        EVENTS = doc.documentElement,
        criticalAlert,
        ammoCounter,
        timeCounter,
        tempGraph,
        rmGraph,
        oldObj;

    // Lightweight CSS selector
    var q$ = function (selector, context) {
        if (typeof selector === 'string') {
            return [].slice.call((context || doc).querySelectorAll(selector));
        }
        return [selector];
    };


    tempGraph = q$('.meter.temp .meterBar');
    rmGraph = q$('.meter.rm .meterBar');
    ammoCounter = q$('.ammo .counter');
    timeCounter = q$('.time .counter');
    criticalAlert = q$('.alert');


    // Update all the things
    var updateEls = function (arr, val) {
        arr.forEach(function (el) {
            el.innerHTML = val;
        });
    };


    // Change a value of a counter
    var updateCounter = function (arr, key, val) {
        var start = Date.now(),
            oldVal,
            tmr;

        if (!oldObj) {
            return;
        }

        oldVal = oldObj[key]

        tmr = setInterval(function () {
            updateEls(arr, val);

            if ((Date.now() - start) > 500) {
                clearInterval(tmr);
            }
        }, 30);
    };


    // Ammo counter
    EVENTS.addTrigger('ammo', function (obj) {
        updateCounter(ammoCounter, 'ammo', obj.ammo);
    });


    // Temp graph
    EVENTS.addTrigger('temp', function (obj) {
        tempGraph.forEach(function (el) {
            el.style.height = ((parseInt(obj.temp, 10) * 84) / 100) + '%';
        });
    });


    // Ammo situation critical
    EVENTS.addTrigger('critical', function (obj) {
        criticalAlert[0].classList.add('active');
    });


    // Ammo situation critical
    EVENTS.addTrigger('depleted', function (obj) {
        criticalAlert[0].classList.add('depleted');
    });


    // Temp
    if (window.mock) {
        mock.forEach(function (obj, index) {
            setTimeout(function () {
                Object.keys(obj).forEach(function (key) {
                    EVENTS.trigger(key, obj);
                });

                oldObj = obj;
            }, index * 500);
        });
    }
} ());