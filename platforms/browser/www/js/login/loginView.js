define(['hbs!js/login/login-view', 'app'], function (template, app) {
    var $ = Framework7.$;

    function render(params) {
        $("#login-template").html(template());
        bindEvents(params.bindings);
        app.activeFocusInput($("li input"));
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return{
        render: render
    }
});