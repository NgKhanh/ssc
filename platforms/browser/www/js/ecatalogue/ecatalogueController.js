define(["app", "js/ecatalogue/ecatalogueView", 'hbs!js/ecatalogue/ecatalogue-sub-cat', 'hbs!js/ecatalogue/ecatalogue-product', "js/pubsubModel"],
    function (app, EcatalogueView, templateSubCat, templateProduct, pubSubModel) {
        var $$ = Dom7;
        var $ = Framework7.$;
        var domain = app.mainSite;
        var pagenumb = 0;
        var loading = false;
        var $parentCatDom, $parentSubCatDom;
        var resetParentCatDom = false;
        var resetSubCatDom = false;
        var currentParentCat;
        var cat = [], product = [], currCatId, namecat;
        var bindings = [
            {
                element: '.parent-cat',
                event: 'click',
                handler: loadSubCat
            },
            {
                element: '.sub-cat',
                event: 'click',
                handler: loadProduct
            }
        ];

        app.f7.onPageAfterAnimation('ecatalogue', function (page) {
            var $$ = Dom7;
            app.f7.attachInfiniteScroll($$('.infinite-scroll'));
            // Last loaded index, we need to pass it to script
            var lastLoadedIndex = $$('.infinite-scroll .list-block li').length;
            // Attach 'infinite' event handler
            $$('.infinite-scroll').on('infinite', function () {
                // Exit, if loading in progress
                if (loading)
                    return;
                // Set loading trigger
                loading = true;

                var api_link = "/api/catalogs";
                $$.each(cat, function (key, value) {
                    if (cat[key].id == currCatId) {
                        api_link = "/api/catalogroot";
                        namecat = cat[key].name;
                        return;
                    }
                });
                $.get(app.mainSite + api_link, {id: currCatId, limit: app.defaultsetting.postperpage, page: pagenumb }, function (data) {
                    loading = true;
                    pagenumb++;
                    if (data === '' || data.length < 5) { // if return [] means equal to 2, so just less than 5 is OK
                        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                        app.f7.detachInfiniteScroll($$('.infinite-scroll'));
                        return false;
                    }
                    else {
                        data = JSON.parse(data);
                        product = data;
                        $("#product-list").append(renderProduct());
                        loading = false;
                    }
                });
            });
        });

        function init() {
            app.f7.onPageBeforeRemove("ecatalogue", function () {
                resetParentCatDom = false;
                resetSubCatDom = false;
                cat = [];
                product = [];
            })

            if (cat.length == 0) {
                loadCat();
            }
            if (product.length == 0 && cat.length > 0) {
                getProduct(cat[0].id);
            }
            if (product.length > 0 && cat.length > 0) {
                currentParentCat = cat[0];
                currCatId = cat[0].id;
                EcatalogueView.render({
                    cat: cat,
                    currCatId: currCatId,
                    subcat: cat[0].sub,
                    namecat: cat[0].name,
                    product: product,
                    bindings: bindings,
                    domain: domain,
                    productlength: product.length
                });
            }
        }


        function loadCat() {
            $.get(app.mainSite + '/api/cataloglist', {}, function (data) {
                data = JSON.parse(data);
                cat = data;

                var parent = [];

                $$.each(cat, function (key, value) {
                    if (value.parent == "") {
                        parent.push(value);
                        cat.slice(key, 1);
                    }
                });

                $$.each(parent, function (key, value) {
                    parent[key]["sub"] = [];
                    $$.each(cat, function (keysub, valuesub) {
                        if (valuesub.parent == value.id) {
                            parent[key]["sub"].push(valuesub);
                            cat.slice(keysub, 1);
                        }
                    });
                });

                cat = parent;
                init();
            });
        }

        function loadSubCat(e) {
            e.preventDefault();
            if (!$(this).hasClass("all")) {
                if (typeof($parentCatDom) == "undefined" || resetParentCatDom == false) {
                    $parentCatDom = $(this).parents(".swiper-wrapper");
                    resetParentCatDom = true;
                }

                $parentCatDom.find(".swiper-slide-active-custom").removeClass("swiper-slide-active-custom");
                $(this).addClass("swiper-slide-active-custom");

                var index = $(this).attr("index");
                currentParentCat = cat[index];
                currCatId = cat[index].id;

                $(".cat-name").html(cat[index].name);
                $(".swiper-sub-cat .swiper-wrapper").html(templateSubCat({
                    namecat: cat[index].name,
                    subcat: cat[index].sub,
                    currCatId: currCatId
                }));

                EcatalogueView.render({
                    bindings: bindings,
                    reloadSwiper: true
                });
            }
            else {
                if (typeof($parentSubCatDom) == "undefined")
                    $parentSubCatDom = $(this).parents(".swiper-wrapper");
                $parentSubCatDom.find(".swiper-slide-active-custom").removeClass("swiper-slide-active-custom");
                $(this).addClass("swiper-slide-active-custom");

                currCatId = $(this).attr("cat-id");
            }

            getProduct(currCatId, false);
        }

        function loadProduct(e) {
            e.preventDefault();
            if (typeof($parentSubCatDom) == "undefined" || resetSubCatDom == false) {
                $parentSubCatDom = $(this).parents(".swiper-wrapper");
                resetSubCatDom = true;
            }
            $parentSubCatDom.find(".swiper-slide-active-custom").removeClass("swiper-slide-active-custom");
            $(this).addClass("swiper-slide-active-custom");

            currCatId = $(this).attr("cat-id");
            getProduct(currCatId, false);
        }

        function renderProduct() {
            return templateProduct({
                product: product,
                domain: domain,
                productlength: product.length,
                namecat: namecat
            });
        }

        function getProduct(catid, doInit) {
            pagenumb = 0;
            loading = false;
            var api_link = "/api/catalogs";
            $$.each(cat, function (key, value) {
                if (cat[key].id == catid) {
                    api_link = "/api/catalogroot";
                    namecat = cat[key].name;
                    return;
                }
            });
            $.get(app.mainSite + api_link, {id: catid, limit: app.defaultsetting.postperpage, page: pagenumb }, function (data) {

                data = JSON.parse(data);
                product = data;
                if (typeof doInit == "undefined")
                    init();
                else {
                    $("#product-list").html(renderProduct());
                }
                pagenumb++;
                app.f7.attachInfiniteScroll($$('.infinite-scroll'));
            });
        }

        return {
            init: init
        };
    });
