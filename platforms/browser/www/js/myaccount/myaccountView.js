define(['hbs!js/myaccount/myaccount-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#myaccount-template").html(template(params.user));
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