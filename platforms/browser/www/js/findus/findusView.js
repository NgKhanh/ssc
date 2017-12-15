define(['hbs!js/findus/findus-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#findus-template").html(template({
                content: params.content
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
});