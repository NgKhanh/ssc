define(["app", "js/panel-left/panel-leftView", "hbs!js/panel-left/panel-left-welcome", "js/userModel", "js/notificationModel", "js/pubsubModel", "js/notificationPublicModel"],
    function (app, panelLeftView, templatePanelLeftWelcome, userModel, notificationModel, pubSubModel, notificationPublicModel) {
        var $ = Framework7.$;
        var $$ = Dom7;
        var numbNotificationUnread = 0;
        var numbPublicNotificationUnread = 0;
        var bindings = [
            {
                element: '.logout',
                event: 'click',
                handler: logout
            },
            {
                element: '.open-login-screen',
                event: 'click',
                handler: loginModal
            },
            {
                element: '.call-us',
                event: 'click',
                handler: callPhone
            },
            {
                element: '.sms-us',
                event: 'click',
                handler: sendSMS
            },
            {
                element: '.open-browser',
                event: 'click',
                handler: openBrowser
            }
        ];

        pubSubModel.on("hasNewNotification", function () {
            init();
        });

        pubSubModel.on("hasNewNotification", function () {
            init();
        });

        pubSubModel.on("readNotification", function (count) {
            $("#section-welcome .numb-notif").html(count);
        });

        pubSubModel.on("deleteNotification", function (index) {
            var count = notificationModel.countNotification();
            $("#section-welcome .numb-notif").html(count);
        });

        pubSubModel.on("readPublicNotification", function (count) {
            $("#section-nav-normal .numb-notif").html(count);
        });

        pubSubModel.on("deletePublicNotification", function (index) {
            var count = notificationPublicModel.countNotification();
            $("#section-nav-normal .numb-notif").html(count);
        });

        pubSubModel.on("userLogin", function (user) {
            if (user.email != userModel.getLastUser() && userModel.getLastUser() != "") {
                notificationModel.removeAllNotification();
            }
            notificationModel.getOnlineNotification(user);

            $.get(app.mainSite + '/api/buzzping', {address: localStorage.getItem("addressNotiDevice"), active: 1}, function (data) {
            });
        });

        pubSubModel.on("new_notification", function () {
            var count = notificationModel.countNotification();
            $("#section-welcome .numb-notif").html(count);
        });

        pubSubModel.on("new_public_notification", function () {
            var count = notificationPublicModel.countNotification();
            $("#section-nav-normal .numb-notif").html(count);
        });

        function init() {
            var isLogin = userModel.isUserLogin();
            console.log(isLogin);

            $$(document).on('ajaxComplete', function (e) {
                var xhr = e.detail.xhr;
            });

            notificationPublicModel.getOnlineNotification();
            if (isLogin) {
                numbNotificationUnread = notificationModel.countNotification();
                $("#welcome-wrap").html(templatePanelLeftWelcome({
                    user: isLogin[0]
                }));
                notificationModel.getOnlineNotification(isLogin[0]);
            }else{
                $("#welcome-wrap").html('Welcome to SSC');
            }


            numbPublicNotificationUnread = notificationPublicModel.countNotification();

            panelLeftView.render({
                isLogin: isLogin,
                bindings: bindings,
                numbNotificationUnread: numbNotificationUnread,
                numbPublicNotificationUnread: numbPublicNotificationUnread
            });
        }

        function logout() {
            app.f7.confirm('Are you sure want to logout?', "Logout Confirm", function () {
                userModel.signoutUser();
                app.f7.closePanel();
                pubSubModel.emit("userLogout");

                $.get(app.mainSite + '/api/buzzping', {address: localStorage.getItem("addressNotiDevice"), active: ''}, function (data) {
                });

                init();
            });
        }

        function loginModal() {

        }

        function callPhone(e) {
            e.preventDefault();
            window.open($(this).attr("data-href"), '_system');
        }

        function sendSMS(e) {
            e.preventDefault();
            window.open($(this).attr("data-href"), '_system');
        }

        function openBrowser(e) {
            e.preventDefault();
            var $el = $(this);
            if ($('html').hasClass('android')) {
                window.open($el.attr("data-fb"), '_system');
            }
            else {
                window.open($el.attr("data-fb"), '_blank');
            }

        }

        return {
            init: init
        };
    });