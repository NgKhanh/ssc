define(["app", "js/cart/cartView", "js/enquiryModel", "js/pubsubModel"],
    function (app, cartView, enquiryModel, pubsubModel) {
        var cart;
        var $ = Framework7.$;
        var deleting;
        var bindings = [
            {
                element: '.remove-item',
                event: 'click',
                handler: removeItem
            },
        ];
        pubsubModel.on("cartChanged", init);
        function init() {
            deleting = true;
            cart = enquiryModel.getCart();
            cartView.render({
                cart: cart,
                bindings: bindings
            });
        }

        function removeItem(e) {
            e.preventDefault();
            if (deleting) {
                deleting = false;
                var that = this;
                app.f7.confirm('Are you sure want to delete it?', 'Confirm Delete', function () {
                    enquiryModel.removeFromCartByIndex($(".remove-item").indexOf(that));
                    pubsubModel.emit("cartChanged");
                }, function () {
                    init();
                });
            }
            e.stopPropagation();
        }


        return {
            init: init
        };
    });
