define(['hbs!js/newsletter/newsletter-view', "app"], function (template, app) {
    var $ = Framework7.$;

    function render(params) {
        $("#newsletter-template").html(template({
            newsletter: params.newsletter,
            count: params.count
        }));
        bindEvents(params.bindings);
        app.activeFocusInput($("li input"));
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