define(['hbs!js/aboutus/about-view'], function (template) {
    var $ = Framework7.$;

    function render(params) {
        $("#aboutus-template").html(template(
            params.model
        ));
    }

    return {
        render: render
    };
});