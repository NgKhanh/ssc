define(["app", "js/ecatalogue-detail/ecatalogue-detailView", "js/ecatalogue-sendmail/ecatalogue-sendmailController", "js/pubsubModel", "js/enquiryModel"],
    function (app, EcatalogueDetailView, EcatalogueSendmailController, pubSubModel, enquiryModel) {
        var $ = Framework7.$;
        var $$ = Dom7;
        var status = "empty";
        var eProd = [];
        var addingToCart;
        var domain = app.mainSite;
        var bindings = [
            {
                element: '.enquiry',
                event: 'click',
                handler: enquiry
            },
            {
                element: '.share',
                event: 'click',
                handler: functionShare
            },
            {
                element: '.remove-from-cart',
                event: 'click',
                handler: removeFromCart
            }
        ];

        EcatalogueSendmailController.init();//set template send mail

        pubSubModel.on("userLogin", refreshSendmail);
        pubSubModel.on("userLogout", refreshSendmail);
        pubSubModel.on("cartChanged", cartChange);

        function refreshSendmail() {
            EcatalogueSendmailController.init();//set template send mail
        }

        function cartChange(){
            init(true);
        }

        function init(query) {
            if (query !== true) {
                $$(".parent-cat-name").html(query.namecat);
                $$(".parent-cat-name").css({
                    "font-size": "12px"
                });
            }
            addingToCart = true;
            if (eProd.length > 0 && query === true) {
                var inCart = enquiryModel.isInCart(eProd[0]);

                EcatalogueDetailView.render({
                    eProd: eProd[0],
                    bindings: bindings,
                    status: status,
                    domain: domain,
                    inCart: inCart
                })
            }
            else {
                loadPage(query);
            }
        }

        function loadPage(query) {
            eProd = [];
            $.get(app.mainSite + '/api/product', {id: query.id}, function (data) {
                if (data === '' || data.length < 5) {

                }
                else {
                    data = JSON.parse(data);
                    eProd.push(data);
                    init(true);
                }
            });
        }

        function enquiry() {
            if (addingToCart) {
                addingToCart = false;
                enquiryModel.addToCart(eProd[0]);
                app.f7.addNotification({
                    message: 'You just added a product to cart.',
                    hold: 2000,
                    closeIcon: false
                });
                pubSubModel.emit("cartChanged");
                init(true);
            }
        }

        function removeFromCart() {
            enquiryModel.removeFromCart(eProd[0]);
            app.f7.addNotification({
                message: 'You just removed a product from cart.',
                hold: 2000,
                closeIcon: false
            });
            pubSubModel.emit("cartChanged");
            init(true);
        }

        function functionShare() {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                url: app.mainSite + 'products/' + eProd[0].id
            }

            var onSuccess = function (result) {
                //app.f7.alert("<p>Success</p>", "Share");
            }

            var onError = function (msg) {
                //app.f7.alert("Sharing failed with message: " + msg, "Share");
            }

            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        }

        return {
            init: init
        };
    });
