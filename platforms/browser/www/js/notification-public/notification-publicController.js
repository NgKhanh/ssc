define(["app", "js/notification-public/notification-publicView", "js/notificationPublicModel", "js/panel-left/panel-leftController", "js/timeModel", "js/pubsubModel", "js/userModel", "hbs!js/notification-public/notification-public-new"],
    function (app, NotificationView, notificationPublicModel, PanelLeftController, TimeModel, pubsubModel, userModel, notificationNewTemplate) {
        var $ = Framework7.$;
        var $$ = Dom7;
        var notification;
        var user;
        var isLoaded = false;
        var count;
        var bindings = [
            {
                element: '#notification-public-template .swipeout-delete',
                event: 'click',
                handler: deleteNotification
            },
            {
                element: '#notification-public-template .to-detail',
                event: 'click',
                handler: toDetail
            }
        ];

        pubsubModel.on("deletePublicNotification", function (index) {
            $$("#notification-public-template .notification-swipeout").eq(index).remove();
        });

        pubsubModel.on("new_public_notification", function (arrNotification) {
            notification = notificationPublicModel.getNotification();
            count = notificationPublicModel.countNotification();
            $("#notification-public-template .count-wrap .count").html(count);
            addNewNotification(arrNotification);
        });

        function init() {
            app.f7.onPageBeforeRemove("notification-public", function () {
                notification = [];
                isLoaded = false;
            });

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

//    NotificationModel.removeAllNotification();
//    console.log(NotificationModel.getNotification());

        function loadPage() {
            notification = notificationPublicModel.getNotification();
            count = notificationPublicModel.countNotification();
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
                var count = notificationPublicModel.removeNotification($(this).attr("data-index"));
                $("#notification-public-template .count").html(count);
                app.f7.swipeoutClose(".swipeout-opened");
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
                pubsubModel.emit("readPublicNotification", count);
                $("#notification-public-template .count").html(count);
                setInterval(function () {
                    $el.find(".new").remove();
                }, 500);

                if ($("#notification-public-template .swipeout-actions-opened").length > 0) {
                    app.f7.swipeoutClose(".swipeout-opened");
                    return;
                }
                $el.removeClass("notification-new");

                notificationPublicModel.updateNotifcation($el.index(), "unread", false);//because new notification always on top array
            }
            app.mainView.router.load({
                url: 'notification-detail-public.html?index=' + index
            })
        }

        function addNewNotification(arr) {
            var notificationTemp = [];
            var temp = notificationPublicModel.getNotification().length - 1;
            $$.each(arr, function (key, value) {
                value["upload_time"] = TimeModel.timeUpload(value.created_at);
                value["index"] = temp++;
                notificationTemp.push(value);//for new
                notification.push(value);// for old
            });
            $("#notification-public-template .notification-list").prepend(notificationNewTemplate({notification: notificationTemp}));
            NotificationView.bindEvents(bindings);
        }

        return {
            init: init
        };
    });
