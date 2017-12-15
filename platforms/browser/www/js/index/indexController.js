define(["app", "js/index/indexView", "js/pubsubModel"], function (app, HomeView, pubsubModel) {
    var $ = Framework7.$;
    var is_access = false;
    var bindings = [
        {
            element: '.link-to',
            event: 'click',
            handler: toPage
        },
        {
            element: '.call-us',
            event: 'click',
            handler: callPhone
        }
    ];

    app.f7.onPageBeforeRemove("index", function () {
        is_access = false;
    })

    function init() {
        pubsubModel.emit("reloadProduct");
        if (!is_access) {
            loadPage();
            is_access = true;
        }
    }

    function loadPage() {
        var pages = [
            {
                title: "E-Catalogue",
                subtitle: "Add items to cart for enquiry",
                key: "e_catalogue",
                img_opt: "ecatalogue_img",
//                src: "./images/home-grid-1.jpg",
                url: "ecatalogue.html"
            },
            {
                title: "PROMOTION",
                subtitle: "",
                key: "promotion",
                img_opt: "promotion_img",
//                src: "./images/home-grid-2.jpg",
                url: "promotion.html"
            },
            {
                title: "CALL US",
                subtitle: "",
                key: "",
                img_opt: "callus_img",
//                src: "./images/home-grid-3.jpg",
                url: "tel:65-62666632",
                tel: true
            },
            {
                title: "FIND US",
                subtitle: "",
                key: "findus",
                img_opt: "findus_img",
//                src: "./images/home-grid-4.jpg",
                url: "findus.html"
            }
        ];
        var copyright;
        var thumbpage = [];
        var big_banner;

        $.get(app.mainSite + '/api/content/option', {key: "copyright_mobile"}, function (data) {
            data = JSON.parse(data);
            copyright = data[0].value;
            $.get(app.mainSite + '/api/content/option', {key: "feature_image"}, function (imgsrc) {
                imgsrc = JSON.parse(imgsrc);
                thumbpage = JSON.parse(imgsrc[0].value);
                big_banner = thumbpage[4].background;
                $.each(pages, function (key, value) {
                    pages[key]["src"] = app.mainSite + thumbpage[key].background;
                })
                HomeView.render({ model: pages, bindings: bindings, big_banner: app.mainSite + big_banner, copyright: copyright});
            });
        });
    }

    function merge_options(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    function toPage(e) {
        e.preventDefault();
//        e = e || window.event;
//        e = e.target || e.srcElement;
//        if (e.nodeName === 'DIV') {
        var url = $(this).attr("data-href");

        app.mainView.router.load({
            url: url
        })
    }

    function callPhone(e) {
        e.preventDefault();
        window.open($(this).attr("data-href"), '_system');
    }

    return {
        init: init
    };
});
