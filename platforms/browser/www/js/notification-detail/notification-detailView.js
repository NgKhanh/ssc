define(['hbs!js/notification-detail/notification-detail-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#notification-detail-template").html(template({
                eNotification: params.eNotification,
                status: params.status
            }
        ))
        ;
        bindEvents(params.bindings);
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render
    };
})
;