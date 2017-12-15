define(['hbs!js/index/index-view', 'app'], function (template, app) {
    var $ = Framework7.$;
    var $$ = Dom7;

    function render(params) {
        $("#index-template").html(template({
            pages: params.model,
            big_banner: params.big_banner,
            copyright: params.copyright
        }));
        bindEvents(params.bindings);
        var swiper = new Swiper('.swiper-home', {
            pagination: '.swiper-pagination',
            paginationClickable: true
        });
        var height = $("html").height() - $(".navbar-fixed .navbar").height() - $(".toolbar-bottom").height();
        if ($(".ios").length > 0) {
            height = height - 10;
        }
        var fix_height = height / 3 - 5;
        $("#index-template li .to-page, #index-template .banner-cover").each(function () {
            $$(this).css({
                "padding-bottom": fix_height + "px"
            })
        });

        updateElement();
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    function updateElement() {
        $.get(app.mainSite + '/api/content/option', {key: "mobile_number"}, function (data) {
            data = JSON.parse(data);
            $(".call-us").attr("data-href", "tel:" + data[0].value);
        });
    }

    return {
        render: render
    };
});