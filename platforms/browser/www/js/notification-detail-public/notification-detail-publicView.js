define(['hbs!js/notification-detail-public/notification-detail-public-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#notification-detail-public-template").html(template({
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