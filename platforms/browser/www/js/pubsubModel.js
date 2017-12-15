define(function(){
    var events = {};
    var on = function (eventName, fn) {
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
    };
    var off = function (eventName, fn) {
        if (events[eventName]) {
            for (var i = 0; i < events[eventName].length; i++) {
                if (events[eventName][i] === fn) {
                    events[eventName].splice(i, 1);
                    break;
                }
            }
            ;
        }
    };
    var emit = function (eventName, data) {
        if (events[eventName]) {
            events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    };
    return {
        on: on,
        off: off,
        emit: emit
    }
});