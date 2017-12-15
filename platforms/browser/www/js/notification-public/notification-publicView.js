define(['hbs!js/notification-public/notification-public-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#notification-public-template").html(template({
            notification: params.notification,
            count: params.count
        }));
        bindEvents(params.bindings);
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        bindEvents: bindEvents
    };
});