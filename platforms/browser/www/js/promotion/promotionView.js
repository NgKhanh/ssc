define(['app', 'hbs!js/promotion/promotion-view'], function (app, template) {
    var $ = Framework7.$;

    function render(params) {
        var empty = params.promotion.length;
        $("#promotion-template").html(template({
            promotion: params.promotion,
            empty: empty,
            domain: app.mainSite
        }));
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
});