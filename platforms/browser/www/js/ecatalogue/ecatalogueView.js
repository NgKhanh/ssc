define(['app', 'hbs!js/ecatalogue/ecatalogue-view'], function (app, template) {
    var $ = Framework7.$;
    var sub_slide;

    function render(params) {
        if (typeof params.reloadSwiper == 'undefined') {
            $("#ecatalogue-template").html(template({
                cat: params.cat,
                namecat: params.namecat,
                currCatId: params.currCatId,
                subcat: params.subcat,
                product: params.product,
                domain: params.domain
            }));

            Swiper('.swiper-cat', {
                speed: 400,
                spaceBetween: 15,
                slidesPerView: "auto",
                freeModeMomentum: true,
                freeModeMomentumRatio: 5
            });

            sub_slide = new Swiper('.swiper-sub-cat', {
                speed: 400,
                slidesPerView: "auto",
                freeModeMomentum: true,
                freeModeMomentumRatio: 5
            });
            $(".swiper-slide-active").addClass("swiper-slide-active-custom");
        }
        else {
            sub_slide.destroy(true, true);
            sub_slide = new Swiper('.swiper-sub-cat', {
                speed: 400,
                slidesPerView: "auto",
                freeModeMomentum: true,
                freeModeMomentumRatio: 5
            });
            $(".swiper-sub-cat .swiper-slide-active").addClass("swiper-slide-active-custom");
        }

        bindEvents(params.bindings);
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        bindEvents: bindEvents
    };
});