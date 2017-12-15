define(["app"], function (app) {
    function addToCart(item) {
        var cart = getCart();
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function getCart() {
        var cart = localStorage.getItem("cart");
        return (cart == '' || cart == null) ? [] : JSON.parse(cart);
    }

    function isInCart(item) {
        var cart = getCart();
        var isIn = false;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i]["id"] == item["id"]) {
                isIn = true;
                break;
            }
        }
        return isIn;
    }

    function removeFromCart(item) {
        var cart = getCart();
        for (var i = 0; i < cart.length; i++) {
            if (cart[i]["id"] == item["id"]) {
                removeFromCartByIndex(i);
                break;
            }
        }
    }

    function removeFromCartByIndex(index){
        var cart = getCart();
        cart.splice( index, 1 );
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function emptyCart() {
        localStorage.setItem('cart', '');
    }

    return {
        addToCart: addToCart,
        getCart: getCart,
        emptyCart: emptyCart,
        isInCart: isInCart,
        removeFromCart: removeFromCart,
        removeFromCartByIndex: removeFromCartByIndex
    };
});