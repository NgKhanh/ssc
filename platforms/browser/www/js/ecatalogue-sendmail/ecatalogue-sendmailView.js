define(['hbs!js/ecatalogue-sendmail/ecatalogue-sendmail-view','app'], function (template, app) {
    var $ = Framework7.$;

    function render(params) {
        $("#ecatalogue-sendmail-template").html(template({
            eProd: params.eProd,
            user: params.user
        }));
        bindEvents(params.bindings);
        app.activeFocusInput($("textarea"));
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