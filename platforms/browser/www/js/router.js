define(function () {
    var $ = Framework7.$;

    /**
     * Init router, that handle page events
     */
    function init() {
        $(document).on('pageBeforeInit', function (e) {
            var page = e.detail.page;
            if (typeof(analytics) !== "undefined") {
                analytics.trackView(page.name);
            }
            if (typeof(mixpanel) !== "undefined") {
                mixpanel.track(page.name);
            }

            load(page.name, page.query);

            //load js in template
            $(page.container).find("script").each(function (el) {
                if ($(this).attr('src')) {
                    jQuery.getScript($(this).attr('src'));
                } else {
                    eval($(this).text());
                }
            });
        });
    }

    /**
     * Load (or reload) controller from js code (another controller) - call it's init function
     * @param controllerName
     * @param query
     */
    function load(controllerName, query) {
        require(['js/' + controllerName + '/' + controllerName + 'Controller'], function (controller) {
            controller.init(query);
        });
    }

    return {
        init: init,
        load: load
    };
});