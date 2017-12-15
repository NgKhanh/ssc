require.config({
    paths: {
        handlebars: "lib/handlebars",
        text: "lib/text",
        hbs: "lib/hbs"
    },
    shim: {
        handlebars: {
            exports: "Handlebars"
        }
    }

});
define('app', ['js/router', "js/pubsubModel", "js/userModel"], function (Router, pubsubModel, userModel) {
    var mainSite = "https://simsiangchoon.com";

    
    if (typeof(mixpanel) !== "undefined") {
        mixpanel.init("b56232433c7565bb17c95972b393d4e2");
    }
    if (typeof(analytics) !== "undefined") {
        analytics.startTrackerWithId("UA-32936868-6");
    } else {
        console.log("Google Analytics Unavailable");
    }
    Router.init();
    /* Use to call function pageInit for index page */
    var $ = Framework7.$;
    var $$ = Dom7;
    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if (deviceType == "iPad" || deviceType == "iPhone") {
        $("body").addClass("ios");
    }
    else {
        $("body").addClass("android");
    }

    var f7 = new Framework7({
        modalTitle: 'F7-MVC-Base',
        swipePanelOnlyClose: true, //close menu by swipe
        animateNavBackIcon: true,
        precompileTemplates: true,
        template7Pages: true//important when use router.load to send data to another page
    });

    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    });

    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
    String.prototype.checkEmail = function () {
        var x = this;
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            return false;
        }
        return true;
    }

    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }

        return temp;
    }

    function activeFocusInput(el) {
        if (deviceType == "Android") {
            el.focus(function () {
                var $el = $(this);
                setTimeout(function () {
                    callBackKeyboardShow($el);
                }, 500)

            })
            el.focusout(function () {
                callBackKeyboardHide($(this));
            })
        }
    }

    function callBackKeyboardShow(e) {
        var $el = e;
        var pos = $el.offset().top;
        var height = $(window).height();
        var distance = height - pos;
        var keyboardH = $(".keyboard-height").html();
        var $pageContent = $el.parents(".page-content");

        var move = distance - (parseInt(keyboardH) - 150);
        if (move <= 0) {
            var moveString = move.toString() + "px";
            $pageContent.children().each(function () {
                $(this).css({
                    position: "relative",
                    top: moveString
                })
            })
        }
//        console.log(height - pos);
    }

    function callBackKeyboardHide(e) {
        var $el = e;
        var $pageContent = $el.parents(".page-content");
        $pageContent.children().each(function () {
            $(this).css({
                position: "static",
                top: "0"
            })
        })
    }

    //use to trigger function for index page

    $(document).on('pageInit', function (e) {
        f7.closePanel();

//        var page = e.detail.page;
//        if (page.name === "aboutus") {
//            //captcha
//            var swiper = new Swiper('.swiper-home', {
//                pagination: '.swiper-pagination',
//                paginationClickable: true
//            });
//        }
    })

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        setTimeout(function () {
            $cordovaSplashscreen.hide()
        }, 100);

        window.open = cordova.InAppBrowser.open;
        if (window.cordova && window.cordova.plugins.Keyboard) {
            if (deviceType == "iPad" || deviceType == "iPhone") {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(false);//maybe it fix scroll up when focus input on IOS
            }
        }

        document.addEventListener("backbutton", function () {
            if (f7.mainView.activePage.name !== "index") {
                f7.mainView.router.back();
            }
            else {
                navigator.app.exitApp();
            }
        }, false);

        window.addEventListener('native.showkeyboard', keyboardShowHandler);
        function keyboardShowHandler(e) {
            $(".page-content").append("<div class='keyboard-height'>" + e.keyboardHeight + "</div>");
        }

        window.addEventListener('native.keyboardhide', keyboardHideHandler);
        function keyboardHideHandler(e) {
        }

//        notification
        if (device.platform == 'iOS') {
            var push = PushNotification.init({
                ios: {
                    "senderID": "452154312634",
                    "gcmSandbox": "true",
                    alert: "true",
                    badge: "true",
                    sound: "true"
                }
            });
        }
        else {
            var push = PushNotification.init({ "android": {"senderID": "452154312634"}});
        }

        push.on('registration', function (data) {
            $.get(mainSite + '/api/buzz', {device: device.platform, address: data.registrationId}, function (data) {
            });

            localStorage.setItem("addressNotiDevice", data.registrationId);
            if(userModel.isUserLogin()){
                // alert(JSON.stringify(data));
                $.get(mainSite + '/api/buzzping', {address: data.registrationId, active: 1}, function (data) {
                });
            }
            else{
                $.get(mainSite + '/api/buzzping', {address: data.registrationId}, function (data) {
                });
            }
        });

        push.on('notification', function (data) {
            pubsubModel.emit('hasNewNotification');
        });

        push.on('error', function (e) {
        });
    }

//    document.addEventListener("resume", function() {
//        f7.mainView.router.load({
//            url: 'index.html',
//            force: true
//        });
//    });

    return {
        f7: f7,
        mainView: mainView,
        router: Router,
        defaultsetting: {
            postperpage: 10
        },
        mainSite: mainSite,
        cloneObject: cloneObject,
        activeFocusInput: activeFocusInput
    };
});