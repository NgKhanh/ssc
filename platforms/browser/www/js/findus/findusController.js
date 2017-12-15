define(["app", "js/findus/findusView"], function (app, FindusView) {
    var $$ = Dom7;
    var $ = Framework7.$;

    var bindings = [
        {
            element: '.view-map',
            event: 'click',
            handler: viewMap
        }
    ];

    function init() {
        $.get(app.mainSite + '/api/content/option', {key: "find_us_content"}, function (data) {
            data = JSON.parse(data);
            var content = data[0].value;
            FindusView.render(
                {
                    content: content,
                    bindings: bindings
                });
        });
    }

    function viewMap(e) {
        e.preventDefault();
        var $el = $(this);
        var address = {
            address: $el.attr("data-address"),
            lat: $el.attr("data-lat"),
            lng: $el.attr("data-lng")
        }
        app.mainView.router.load({
            url: $el.attr("data-href"),
            context: address
        })

        console.log(address);
    }

    return {
        init: init
    };
});
