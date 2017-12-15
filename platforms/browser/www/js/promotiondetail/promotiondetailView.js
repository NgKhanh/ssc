define(['app','hbs!js/promotiondetail/promotiondetail-view'], function (app, template) {
    var $ = Framework7.$;

    function render(params) {
        $("#promotiondetail-template").html(template({
                promo: params.promo,
                status: params.status,
                domain: app.mainSite,
                expiredate: params.expiredate
            }
        ));
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