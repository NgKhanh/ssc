define(["app", "js/login/loginView", "js/userModel", "js/panel-left/panel-leftController", "js/pubsubModel"],
    function (app, LoginView, UserModel, panelLeftCtrl, pubSubModel) {
    var $$ = Dom7;
    var bindings = [
        {
            element: '.login-button',
            event: 'click',
            handler: loginClick
        },
        {
            element: '.register-button',
            event: 'click',
            handler: register
        }
    ];

    function init() {
        LoginView.render({
            bindings: bindings
        });
    }

    function loginClick(){
        login();
    }

    function login(formRegister) {
        var formInput;
        if (typeof formRegister == "undefined") {
            formInput = app.f7.formToJSON('#login-form');
        }
        else {
            formInput = formRegister;
        }
        $$.get(app.mainSite + '/api/account/login', formInput, function (data) {
            data = JSON.parse(data);
            if (data[0].error) {
                app.f7.alert("<p>" + data[0].error + "</p>", "Login Fail");
            }
            else {
                UserModel.loginUser(data);

                // inform login
                pubSubModel.emit("userLogin", data[0]);

                $$("#login-form .reset-form").click();
                panelLeftCtrl.init();
                app.f7.addNotification({
                    message: 'Login Success',
                    hold: 2000,
                    closeIcon: false,
                    onClose: redirect
                });
            }
        });
    }

    function redirect() {
        app.mainView.router.back();
    }

    function register() {
        var formInput = app.f7.formToJSON('#register-form');
        if(formInput.password.length < 6){
            app.f7.alert("<p>Password need more than 6 characters</p>", "Login Fail");
        }
        else{
            $$.get(app.mainSite + '/api/account/register', formInput, function (data) {
                data = JSON.parse(data);
                if (data !== "Register success") {
                    var error = "";
                    $$.each(data, function (key, val) {
                        error += "<p>" + key + " ";
                        error += val[0] + "</p>";
                    });
                    app.f7.alert(error, "Register Fail");
                }
                else {
                    $$("#register-form .reset-form").click();
                    app.f7.addNotification({
                        message: 'Register Success',
                        hold: 500,
                        closeIcon: false,
                        onClose: login(formInput)
                    });
                    $$.get(app.mainSite + '/api/sendmails', {
                        sendto: formInput.email,
                        subject : "Register Success",
                        name: formInput.name,
                        email: formInput.email,
                        contact: formInput.contact
                    }, function(data){

                    });
                }
            });
        }
    }

    return {
        init: init
    };
});
