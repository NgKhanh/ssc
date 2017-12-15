define(["app"], function (app) {
    function addPromotion(promotion) {
        var promo = getPromotion();
        promo.unshift(promotion);
        localStorage.setItem("promotion", JSON.stringify(promo));
        return promo.length;
    }

    function removePromotion(index) {
        var promo = getPromotion();
        promo.splice(index, 1);
        localStorage.setItem("promotion", JSON.stringify(promo));
        return promo.length;
    }

    function removeAllPromotion() {
        localStorage.setItem("promotion", JSON.stringify([]));
    }

    function getPromotion() {
        var promo = JSON.parse(localStorage.getItem("promotion"));
        return promo ? promo : [];
    }



    return {
        addPromotion: addPromotion,
        removePromotion: removePromotion,
        getPromotion: getPromotion,
        removeAllPromotion: removeAllPromotion
    };
});