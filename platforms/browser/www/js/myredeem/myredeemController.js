define(["app", "js/myredeem/myredeemView", "js/promotionModel", "js/pubsubModel", "js/userModel"],
    function (app, myredeemView, promotionModel, pubSubModel, userModel) {
        var $$ = Dom7;
        var $ = Framework7.$;
        var curUser;
        var isLoaded = false;//did call load page function
        var isAccess = false;//did access in page

        var promotion;
        var bindings = [
            {
                element: '.show-redeem-detail',
                event: 'click',
                handler: showRedeemDetail
            }
        ];

        function init() {
            //always update new promotion
            app.f7.onPageBeforeRemove("myredeem", function () {
                promotion = [];
                isLoaded = false;
                isAccess = false;
            })
            if (typeof promotion == "undefined" || (promotion.length == 0 && !isLoaded)) {
                loadPage();
            }
            else {
                myredeemView.render({ promotion: promotion, bindings: bindings});
            }
        }

        function loadPage() {
            isLoaded = true;
            if (!isAccess) {
                curUser = userModel.isUserLogin();
                if (curUser) {
                    $.get(app.mainSite + '/api/redeemlist', {cid: curUser[0].id}, function (dataouter) {
                        dataouter = JSON.parse(dataouter);
                        promotion = [];

                        var idArr = dataouter;
                        if (idArr.length > 0) {
                            var length = idArr.length;
                            $$.each(idArr, function (key, value) {
                                var temp;
                                $.get(app.mainSite + '/api/promotion', {id: value["promotion_id"]}, function (data) {
                                    temp = JSON.parse(data);
                                    promotion.push(temp);

                                    if (key == length - 1 && promotion.length > 0) {
                                        localStorage.setItem("promotion", JSON.stringify(promotion));
                                        init();
                                    }
                                });
                            });
                        }
                        else{
                            localStorage.setItem("promotion", JSON.stringify(promotion));
                            init();
                        }
                    });
                }
                isAccess = true;
            }
        }

        function showRedeemDetail(e) {
            e.preventDefault();
            app.mainView.router.load({
                url: $(this).attr("data-href"),
                context: promotion[$(this).attr("index")]
            })
        }

        return {
            init: init
        };
    });
