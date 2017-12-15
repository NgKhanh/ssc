define(['hbs!js/ecatalogue-detail/ecatalogue-detail-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#ecatalogue-detail-template").html(template({
                eProd: params.eProd,
                status: params.status,
                domain: params.domain,
                inCart: params.inCart
            }
        ))
        ;
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