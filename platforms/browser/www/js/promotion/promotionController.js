define(["app", "js/promotion/promotionView", "js/promotionModel", "js/userModel", "js/pubsubModel"],
    function (app, PromotionView, promotionModel, userModel, pubSubModel) {
        var $$ = Dom7;
        var $ = Framework7.$;
        var promotion;
        var isLoaded = false;
        var curUser = [];
        var bindings = [
            {
                element: '.view-promotion-detail',
                event: 'click',
                handler: toPromotionDetail
            }
        ];

        pubSubModel.on("userLogin", function () {
            promotion = [];
            isLoaded = false;
            curUser = [];
            init();
        });

        function init() {
            pubSubModel.emit("reloadProduct");

            //always update new promotion
            app.f7.onPageBeforeRemove("promotion", function () {
                promotion = [];
                isLoaded = false;
                curUser = [];
            })

            if (typeof promotion == "undefined" || (promotion.length == 0 && !isLoaded)) {
                loadPage();
            }
            else {
                PromotionView.render(
                    {
                        promotion: promotion,
                        bindings: bindings
                    });
            }

        }

        function loadPage() {
            isLoaded = true;

            //check current user
            if (curUser.length == 0) {
                curUser = userModel.isUserLogin();
            }

            // get all promotion of current user

            if (curUser && curUser.length > 0) {
                $.get(app.mainSite + '/api/redeemlist', {cid: curUser[0].id}, function (data) {
                    var idArr = JSON.parse(data);

                    $.get(app.mainSite + '/api/promotionlist', {}, function (data) {
                        data = JSON.parse(data);
                        promotion = data;

                        //update attribute redeemed to promotion list
                        if (idArr.length > 0) {
                            $$.each(idArr, function (keyMyRedeem, valueMyRedeem) {

                                $$.each(promotion, function (keyPromotion, valuePromotion) {
                                    if (valueMyRedeem["promotion_id"] == valuePromotion.id) {
                                        valuePromotion["redeemed"] = true;
                                        return;
                                    }
                                })
                            });
                        }
                        init();
                    });
                });
            }
            else{
                $.get(app.mainSite + '/api/promotionlist', {}, function (data) {
                    data = JSON.parse(data);
                    promotion = data;
                    init();
                });
            }



        }

        function toPromotionDetail(e) {
            e.preventDefault();
            var $el = $(this);
            app.mainView.router.load({
                url: $el.attr("data-href"),
                context: promotion[$el.attr("data-index")],
                ignoreCache: true
            })
        }

        return {
            init: init
        };
    });
