;(function (undefined) {
    var doc = document,
        EVENTS = doc.documentElement,
        timers = {},
        criticalAlert,
        ammoCounter,
        timeCounter,
        tempGraph,
        rmGraph,
        oldObj,
        main,
        tmpl;


    // Lightweight CSS selector
    var q$ = function (selector, context) {
        if (typeof selector === 'string') {
            return [].slice.call((context || doc).querySelectorAll(selector));
        }
        return [selector];
    };


    // Build UI
    main = q$('main')[0];
    tmpl = q$('#template_cp')[0].innerHTML;

    ['backFace', 'frontFace'].forEach(function (className) {
        main.innerHTML += tmpl.replace('${class}', className);
    });


    // Cache elements
    criticalAlert = q$('.frontFace .alert');
    tempGraph = q$('.meter.temp .meterBar');
    rmGraph = q$('.meter.rm .meterBar');
    ammoCounter = q$('.ammo .counter');
    timeCounter = q$('.time .counter');


    // Update all the things
    var updateEls = function (arr, val) {
        arr.forEach(function (el) {
            el.innerHTML = val;
        });
    };


    // Change a value of a counter
    var updateCounter = function (arr, key, val) {
        var curVal;

        clearTimeout(timers[key]);

        if (!oldObj) {
            updateEls(arr, val);
            return;
        }

        curVal = parseInt(oldObj[key], 10);

        timers[key] = setInterval(function () {
            updateEls(arr, curVal);
            curVal--;

            if (curVal < val || curVal === 0) {
                clearInterval(timers[key]);
            }
        }, 40);
    };


    // Ammo counter
    EVENTS.addTrigger('ammo', function (obj) {
        updateCounter(ammoCounter, 'ammo', obj.ammo);
    });


    // Graph
    EVENTS.addTrigger('temp', function (obj) {
        var rm = Math.floor(Math.random() * (54 + 1));

        // Update temp graph
        tempGraph.forEach(function (el) {
            el.style.height = ((parseInt(obj.temp, 10) * 84) / 100) + '%';
        });

        //Periodically stall RM graph
        if (parseInt(obj.temp, 10) === 0) {
            rm = 0;
        } else if (rm % 2 === 0) {
            return;
        }

        // Update RM graph
        rmGraph.forEach(function (el) {
            el.style.height = rm + '%';
        });
    });


    // Ammo situation critical
    EVENTS.addTrigger('critical', function (obj) {
        if (criticalAlert[0].classList.contains('depleted')) {
            return;
        }
        criticalAlert[0].classList.add('active')
        criticalAlert[0].classList.toggle('flash');
    });


    // Ammo situation critical
    EVENTS.addTrigger('depleted', function (obj) {
        criticalAlert[0].classList.remove('flash');
        criticalAlert[0].classList.add('depleted');
    });


    // Temp - this will be a SSE stream
    if (window.mock) {
        mock.forEach(function (obj, index) {
            setTimeout(function () {
                Object.keys(obj).forEach(function (key) {
                    EVENTS.trigger(key, obj);
                });

                oldObj = obj;
            }, index * 250);
        });
    }
} ());