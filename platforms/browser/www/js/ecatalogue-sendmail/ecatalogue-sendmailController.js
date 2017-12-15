define(["app", "js/ecatalogue-sendmail/ecatalogue-sendmailView", "js/notificationModel", "js/userModel", "js/enquiryModel", "js/pubsubModel"],
    function (app, EcatalogueEmailView, NotificationModel, UserModel, enquiryModel, pubsubModel) {

        var $ = Framework7.$;
        var cart;
        var status = "empty";
        var user;
        var bindings = [
            {
                element: '.send-email-enquiry',
                event: 'click',
                handler: sendEmail
            },
            {
                element: '.panel-close.link',
                event: 'click',
                handler: function () {
                    app.f7.closeModal('#ecatalogue-sendmail-template');
                }
            }
        ];

        function init() {
            user = UserModel.isUserLogin();
            cart = enquiryModel.getCart();

            EcatalogueEmailView.render({
                bindings: bindings,
                status: status,
                user: user
            });
        }

        function sendEmail() {
            var formInput = app.f7.formToJSON('#enquiryForm');
            if (formInput.enquiry.trim() == "" || formInput.clientName.trim() == ""
                || formInput.clientEmail.trim() == "" || formInput.clientPhone.trim() == "") {
                app.f7.alert("All field is required", "Send Enquiry Fail");
            }
            else if (!formInput.clientEmail.checkEmail()) {
                app.f7.alert("Invalid Email", "Send Enquiry Fail");
            }
            else {
                var product = [];
                for (var i = 0; i < cart.length; i++) {
                    product.push(cart[i]["id"]);
                }

                $.post(app.mainSite + '/api/checkout', {
                    name: formInput.clientName,
                    phone: formInput.clientPhone,
                    email: formInput.clientEmail,
                    mess: formInput.enquiry,
                    product: JSON.stringify(product)
                }, function (data) {
                    data = JSON.parse(data);
                    if (data == "success") {
                        app.f7.addNotification({
                            message: 'SEND SUCCESS',
                            hold: 2000,
                            onClose: function () {
                                app.f7.closeModal('#ecatalogue-sendmail-template');
                            },
                            closeIcon: false
                        });
                        init();
                        enquiryModel.emptyCart();
                        pubsubModel.emit("cartChanged");
                    }
                    else {
                        console.log(data);
                    }

                }, function (e) {
                    console.log(e);
                });
            }


        }

        return {
            init: init
        };
    });
