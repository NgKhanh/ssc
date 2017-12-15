define(['app','hbs!js/myredeem/myredeem-view'], function (app, template) {
    var $ = Framework7.$;

    function render(params) {

        $("#myredeem-template").html(template({
            promotion: params.promotion,
            empty: params.promotion.length,
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