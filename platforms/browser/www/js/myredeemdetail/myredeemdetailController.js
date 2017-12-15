define(["app", "js/myredeemdetail/myredeemdetailView"], function (app, myredeemdetailView) {
    var promo;
    var access = false;

    app.f7.onPageAfterAnimation('myredeemdetail', function (page) {
        if (!access) {
            access = true;
            promo = page.context;
            promo.expired = isExpired();
            changeFormatTime();
            myredeemdetailView.render({
                promo: promo
            });
        }
    });
    app.f7.onPageBeforeRemove('myredeemdetail', function(page){
        access = false;
    });

    function init() {

    }

    function changeFormatTime() {
        var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];

        var date = new Date(promo.expire.replace(/-/g, '/'));

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        promo.expire = year + ', ' + monthNames[monthIndex] + ' ' + day;
    }

    function isExpired() {
        var diff = new Date() - new Date(promo.expire.replace(/-/g, '/'));
        if (diff > 0) {
            return true;
        }
        return false;
    }

    return {
        init: init
    };
});
