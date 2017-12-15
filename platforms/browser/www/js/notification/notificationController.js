define(["app", "js/notification/notificationView", "js/notificationModel", "js/panel-left/panel-leftController", "js/timeModel", "js/pubsubModel", "js/userModel", "hbs!js/notification/notification-new"],
    function (app, NotificationView, NotificationModel, PanelLeftController, TimeModel, pubsubModel, userModel, notificationNewTemplate) {
        var $ = Framework7.$;
        var $$ = Dom7;
        var notification;
        var user;
        var isLoaded = false;
        var count;
        var bindings = [
            {
                element: '#notification-template .swipeout-delete',
                event: 'click',
                handler: deleteNotification
            },
            {
                element: '#notification-template .to-detail',
                event: 'click',
                handler: toDetail
            }
        ];

        pubsubModel.on("deleteNotification", function (index) {
            $$("#notification-template .notification-swipeout").eq(index).remove();
        });

        pubsubModel.on("new_notification", function (arrNotification) {
            notification = NotificationModel.getNotification();
            count = NotificationModel.countNotification();
            $("#notification-template .count-wrap .count").html(count);
            addNewNotification(arrNotification);
        });

        pubsubModel.on("userLogout", function (user) {
            notification = [];
            isLoaded = false;
            setTimeout(function () {
                app.mainView.router.load({
                    url: "index.html",
                    ignoreCache: true
                })
            }, 800);
        });

        pubsubModel.on("userLogin", function (user) {
            notification = [];
            isLoaded = false;
        });

        function init() {
            app.f7.onPageBeforeRemove("notification", function () {
                notification = [];
                isLoaded = false;
            })

            user = userModel.isUserLogin();
            if (!user) {
                app.f7.main.router.back();
            }
            else {
                if (typeof notification == "undefined" || (notification.length == 0 && !isLoaded)) {
                    isLoaded = true;
                    loadPage();
                }
                else {
                    NotificationView.render({
                        notification: notification,
                        count: count,
                        bindings: bindings
                    });
                }
            }
        }

//    NotificationModel.removeAllNotification();
//    console.log(NotificationModel.getNotification());

        function loadPage() {
            notification = NotificationModel.getNotification();
            count = NotificationModel.countNotification();
            // set current last id

            $$.each(notification, function (key, val) {
                notification[key]["upload_time"] = TimeModel.timeUpload(val.created_at);
            });

            init();
        }

        function deleteNotification(e) {
            e.preventDefault();
            var $el = $(this);
            app.f7.confirm('Are you sure want to delete it?', 'Confirm Delete', function () {
                var count = NotificationModel.removeNotification($(this).attr("data-index"));
                $("#notification-template .count").html(count);
                app.f7.swipeoutClose("#notification-template .swipeout-opened");
                setInterval(function () {
                    $el.parents("li").remove();
                }, 500);
            });
            e.stopPropagation();
        }

        function toDetail(e) {
            e.preventDefault();

            var $el = $(this);
            var detailNotification;
            var index = $el.index();

            detailNotification = notification[index];
            detailNotification["index"] = index;

            if (detailNotification.unread) {
                detailNotification.unread = false;
                //inform view notification
                if (count > 0)
                    count = count - 1;
                pubsubModel.emit("readNotification", count);
                $("#notification-template .count").html(count);
                setInterval(function () {
                    $el.find(".new").remove();
                }, 500);

                if ($("#notification-template .swipeout-actions-opened").length > 0) {
                    app.f7.swipeoutClose("#notification-template .swipeout-opened");
                    return;
                }
                $el.removeClass("notification-new");

                NotificationModel.updateNotifcation($el.index(), "unread", false);//because new notification always on top array
            }
            app.mainView.router.load({
                url: 'notification-detail.html?index=' + index
            })
        }

        function addNewNotification(arr) {
            var notificationTemp = [];
            var temp = NotificationModel.getNotification().length - 1;
            $$.each(arr, function (key, value) {
                value["upload_time"] = TimeModel.timeUpload(value.created_at);
                value["index"] = temp++;
                notificationTemp.push(value);//for new
                notification.push(value);// for old
            });
            $("#notification-template .notification-list").prepend(notificationNewTemplate({notification: notificationTemp}));
            NotificationView.bindEvents(bindings);
        }

        return {
            init: init
        };
    });
