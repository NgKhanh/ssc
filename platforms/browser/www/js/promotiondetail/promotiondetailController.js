define(["app", "js/promotiondetail/promotiondetailView", "js/userModel", "js/promotionModel"], function (app, PromotiondetailView, userModel, promotionModel) {
    var $ = Framework7.$;
    var status = "empty";
    var user = userModel.isUserLogin();
    var promo;
    var expiredate;
    var access = false;
    var bindings = [
        {
            element: '.add-redeem',
            event: 'click',
            handler: addRedeem
        },
        {
            element: '.share',
            event: 'click',
            handler: functionShare
        }
    ];

    app.f7.onPageAfterAnimation('promotiondetail', function (page) {
        if (!access) {
            access = true;
            promo = page.context;
            promo.expired = isExpired();
            changeFormatTime();

            PromotiondetailView.render({
                promo: promo,
                bindings: bindings,
                status: status,
                expiredate: expiredate
            });
        }
    });
    app.f7.onPageBeforeRemove('promotiondetail', function(page){
        access = false;
    });

    function init() {
        user = userModel.isUserLogin();
    }

    function addRedeem(e) {
        e.preventDefault();
        var $el = $(this);
        if ($el.hasClass("redeemed")) {
            return;
        }
        if (user && user.length > 0) {
            var user_temp = user[0];

            $.get(app.mainSite + '/api/redeem/create',
                {
                    cid: user_temp.id,
                    customer: user_temp.name,
                    pid: promo.id,
                    promotion: promo.title
                },
                function (data) {
                    data = JSON.parse(data);
                    if (data == "Redeem success") {
                        $el.html('<i class="fa fa-check-circle" aria-hidden="true"></i> Redeemed!');
                        $(".info-redeem").addClass("show");
                        $el.addClass("redeemed");
                        $.get(app.mainSite + '/api/sendmails', {
                            sendto: user_temp.email,
                            subject: "Redeem Success",
                            promo: promo.title,
                            name: user_temp.name
                        }, function (data) {

                        });
                        promo.redeemed = true;
                        promotionModel.addPromotion(promo);
                    }
                });
        }
        else {
            app.f7.alert("<p>Please login to redeem</p>", "Login");
        }

        return JSON.parse(localStorage.getItem("storageRedeem"));
    }

    function changeFormatTime() {
        var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        var date = new Date(promo.expire.replace(/-/g, '/'));


        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        expiredate = year + ', ' + monthNames[monthIndex] + ' ' + day;
    }

    function isExpired() {
        var diff = new Date() - new Date(promo.expire.replace(/-/g, '/'));
        if (diff > 0) {
            return true;
        }
        return false;
    }

    function functionShare() {
        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
            message: 'share this', // not supported on some apps (Facebook, Instagram)
            subject: 'the subject', // fi. for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: 'https://www.website.com/foo/#bar?a=b',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }

        var onSuccess = function (result) {
            app.f7.alert("<p>Success</p>", "Share");
        }

        var onError = function (msg) {
            app.f7.alert("Sharing failed with message: " + msg, "Share");
        }

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }

    return {
        init: init
    };
});
