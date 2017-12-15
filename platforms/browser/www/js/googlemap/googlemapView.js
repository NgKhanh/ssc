define(['hbs!js/googlemap/googlemap-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#googlemap-template").html(template());
    }



    return {
        render: render
    };
})
;