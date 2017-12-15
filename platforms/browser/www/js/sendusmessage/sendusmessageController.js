define(["app", "js/sendusmessage/sendusmessageView", "js/notificationModel", 'js/panel-left/panel-leftController', "js/userModel", "js/pubsubModel"],
    function (app, SendUsMessageView, NotificationModel, PanelLeftController, UserModel, pubSubModel) {
        var $$ = Dom7;
        var $ = Framework7.$;
        var myApp = app.f7;
        var eProd;
        var user;
        var status = "empty";
        var bindings = [
            {
                element: '.send-email',
                event: 'click',
                handler: sendEmail
            }
        ];

        pubSubModel.on("userLogin", init);
        pubSubModel.on("userLogout", init);
        function init() {
            user = UserModel.isUserLogin();
            SendUsMessageView.render({
                bindings: bindings,
                user: user
            });
        }

        function sendEmail(e) {
            e.preventDefault();
            var formInput = app.f7.formToJSON('#send-us-message-form');
            var formCaptcha = app.f7.formToJSON('#captcha-form');
            if (formInput.enquiry.trim() == "" || formCaptcha.txtInput.trim() == "" ||
                formInput.clientName.trim() == "" || formInput.clientEmail.trim() == "") {
                app.f7.alert("<p>Please don't send blank text</p>", "Send Fail");
            }
            else if (!formInput.clientEmail.checkEmail()) {
                app.f7.alert("Invalid Email", "Send Enquiry Fail");
            }
            else {
                if (checkform(formCaptcha)) {
                    $$("#send-us-message-form .reset-form").click();
                    SendUsMessageView.resetCaptcha();
                    $$("#captcha-form .reset-form").click();
                    $$.get(app.mainSite + '/api/sendmails', {
                        sendto: formInput.clientEmail,
                        subject: "Message from user",
                        name: formInput.clientName,
                        phone: formInput.clientPhone,
                        email: formInput.clientEmail,
                        mess: formInput.enquiry,
                        company: formInput.clientCompany
                    }, function (data) {
                        data = JSON.parse(data);
                        if (data == "Sending success") {

                            app.f7.addNotification({
                                message: 'SEND SUCCESS',
                                hold: 2000,
                                closeIcon: false,
                                onClose: function () {
                                    $$(".reset-form").click();
                                }
                            });
                        }
                        else {
                            alert(data);
                        }
                    });
                    PanelLeftController.init();
                }
            }
        }

        function checkform(theform) {
            var why = "";

            if (theform["txtInput"] != "") {
                if (ValidCaptcha(theform, theform["txtInput"]) == false) {
                    why += "Security code did not match.\n";
                }
            }
            if (why != "") {
                app.f7.alert("<p>" + why + "</p>", "Send Fail");
                return false;
            }
            return true;
        }

// Validate the Entered input aganist the generated security code function
        function ValidCaptcha(theform, inputVal) {
            var str1 = removeSpaces(theform["txtCaptcha"]);
            var str2 = removeSpaces(theform["txtInput"]);
            if (str1 == str2) {
                return true;
            } else {
                return false;
            }
        }

// Remove the spaces from the entered and generated code
        function removeSpaces(string) {
            return string.split(' ').join('');
        }

        return {
            init: init
        };
    });
