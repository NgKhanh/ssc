define(['app', 'hbs!js/cart/cart-view'], function (app, template) {
    var $ = Framework7.$;

    function render(params) {
        $("#cart-template").html(template({
            cart: params.cart,
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