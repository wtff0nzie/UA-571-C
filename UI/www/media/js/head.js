(function () {
    var docEl = document.documentElement;

    window.UA = (function (win, doc) {
        var styles = win.getComputedStyle(docEl, ''),
            pre = ([].slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1],
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1],
            nv = win.navigator,
            rx,
            ie;

        if (pre === 'ms') {
            rx = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
            rx.exec(nv.userAgent);
            ie = parseFloat(RegExp.$1);
        }

        return {
            css         : '-' + pre + '-',
            dom         : dom,
            lowercase   : pre,
            ie          : (ie || false),
            js          : pre[0].toUpperCase() + pre.substr(1),
            platform    : nv.platform.toLowerCase(),
            phoneGap    : !!window.cordova,
            touch       : ('ontouchstart' in docEl || 'onmsgesturechange' in win) ? true : false
        };
    }(window, document));

    docEl.className = (' ' + docEl.className + ' ua-' + UA.lowercase + ' ' + ' os-' + UA.platform + ' ie-' +  UA.ie + ' ' + ((UA.touch) ? 'has-touch' : 'no-touch') + ' ' + ((UA.phoneGap) ? 'is-phonegap' : 'no-phonegap')).replace(' no-js ', ' js ').replace(' loading ', ' loaded ').trim();
}());