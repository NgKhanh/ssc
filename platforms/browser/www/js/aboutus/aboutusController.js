define(["app", "js/aboutus/aboutView"], function (app, AboutView) {
    var $ = Framework7.$;
    function init() {
        loadContent();
    }

    function loadContent(){
        $.get(app.mainSite + '/api/content/page', {id: 4}, function (data) {
            data = JSON.parse(data);
            AboutView.render({
                model: data[0]
            })
        });
    }

    return {
        init: init
    };
});
