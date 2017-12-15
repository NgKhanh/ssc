define(['app', 'hbs!js/myredeemdetail/myredeemdetail-view'], function (app, template) {
    var $ = Framework7.$;

    function render(params) {
        $("#myredeemdetail-template").html(template({
                promo: params.promo,
                domain: app.mainSite
            }

        ));
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