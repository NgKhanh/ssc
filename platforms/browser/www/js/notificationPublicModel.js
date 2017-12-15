define(["app", "js/timeModel", "js/userModel", 'js/pubsubModel'], function (app, TimeModel, userModel, pubSubModel) {
    var $$ = Dom7;
    var notificationGeneral = {
        title: "NEW PRODUCTS ARE LAUNCHED!",
        text: "With our main corporate showroom cum warehouse facility of 100,000 square feet at Changi South, Sim Siang Choon...",
        time: new Date().getTime(),
        unread: true
    };

    function addNotificationCus(notification) {
        var notification = notification || notificationGeneral;
        var notif = getNotification();
        notif.unshift(notification);
        localStorage.setItem("notificationPublic", JSON.stringify(notif));
        return notif.length;
    }

    function removeNotification(index) {
        var notif = getNotification();
        notif.splice(index, 1);
        localStorage.setItem("notificationPublic", JSON.stringify(notif));
        return countNotification();
    }

    function getNotification() {
        var notif = JSON.parse(localStorage.getItem("notificationPublic"));
        return notif ? notif : [];
    }

    function getNotificationUnread() {
        var notif = JSON.parse(localStorage.getItem("notificationPublic"));
        var notifUnread = [];
        $$.each(notif, function (key, value) {
            if (notif[key].unread) {
                notifUnread.push(value);
            }
        })
        return notifUnread;
    }

    function updateNotifcation(index, attrName, val) {
        var notif = getNotification();
        $$.each(notif, function (key, value) {
            if (key == index) {
                value[attrName] = val;
                return;
            }
        })
        localStorage.setItem("notificationPublic", JSON.stringify(notif));
    }

    function countNotification() {
        var notif = getNotificationUnread();
        return notif.length;
    }


    function removeAllNotification() {
        localStorage.setItem("notificationPublic", JSON.stringify([]));
    }

    function add_current_public_notification_id(id){
        localStorage.setItem("notificationPublicCurrentId", id);
    }

    function get_current_public_notification_id(){
        var id = localStorage.getItem("notificationPublicCurrentId");
        return id ? id : '0';
    }

    function getOnlineNotification(){
        var currentId = get_current_public_notification_id();

        $$.get(app.mainSite + '/api/notices', {id: currentId}, function (data) {
            data = JSON.parse(data);
            if(data.length > 0){
                var current_id_notification = data[0].id;
                add_current_public_notification_id(current_id_notification + 1);
                $$.each(data, function (key, value) {
                    value.unread = true;
                    value["created_at"] = (new Date().getTime() + (+7) * 3600 * 1000)/1000;
                    addNotificationCus(value);
                    if(key == data.length - 1){
                        pubSubModel.emit("new_public_notification", data);
                        app.f7.addNotification({
                            message: 'there is new notification',
                            hold: 2000,
                            closeIcon: false
                        });
                    }
                });
            }
        });
    }

    return {
        getOnlineNotification: getOnlineNotification,
        addNotificationCus: addNotificationCus,
        removeNotification: removeNotification,
        getNotification: getNotification,
        countNotification: countNotification,
        removeAllNotification: removeAllNotification,
        updateNotifcation: updateNotifcation
    };
});