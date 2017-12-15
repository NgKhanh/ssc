define(["app", "js/myaccount/myaccountView", "js/userModel", "js/panel-left/panel-leftController", "js/pubsubModel"],
    function (app, MyaccountView, UserModel, panelLeftCtrl, pubSubModel) {
    var $ = Framework7.$;
    var user = UserModel.isUserLogin();
    var bindings = [
        {
            element: '.update-user',
            event: 'click',
            handler: updateUser
        }
    ];

    pubSubModel.on("userLogout", function () {
        app.mainView.router.load({
            url: 'index.html',
            ignoreCache: true
        })
    });

    function init() {
        app.f7.onPageBeforeRemove("myaccount", function () {
            user = UserModel.isUserLogin();
        })
        MyaccountView.render({
            user: user[0],
            bindings: bindings
        });
    }

    function updateUser() {
        var formInput = app.f7.formToJSON('#my-account-form');
        if (formInput.name.trim() == "" || formInput.contact.trim() == "") {
            app.f7.alert("Please don't send blank text", "Update Fail");
        }
        else {
            app.f7.modalPassword('Your password please:', "UPDATE INFO", function (value) {
                $.get(app.mainSite + '/api/account/updateuser', {id: user[0].id, name: formInput.name, contact: formInput.contact, password: value}, function (data) {
                    data = JSON.parse(data);
                    if (data == "update success") {
                        UserModel.updateUser(formInput);

                        panelLeftCtrl.init();
                        app.f7.addNotification({
                            message: 'UPDATE SUCCESS',
                            hold: 2000,
                            onClose: backFunction,
                            closeIcon: false
                        });
                    }
                    else {
                        app.f7.alert("Wrong Password", "Update Fail");
                    }
                });
            });
        }
    }

    function backFunction(){
        app.mainView.router.back();
    }

    return {
        init: init
    };
});
