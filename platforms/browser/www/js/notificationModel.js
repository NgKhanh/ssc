define(["app", "js/timeModel", "js/userModel", 'js/pubsubModel'], function (app, TimeModel, userModel, pubSubModel) {
    var $$ = Dom7;
    var current_id_notification;

    function addNotificationCus(notification) {
        var notification = notification;
        var notif = getNotification();
        notif.unshift(notification);
        localStorage.setItem("notification", JSON.stringify(notif));
        return notif.length;
    }

    function removeNotification(index) {
        var notif = getNotification();
        notif.splice(index, 1);
        localStorage.setItem("notification", JSON.stringify(notif));
        return countNotification();
    }

    function getNotification() {
        var notif = JSON.parse(localStorage.getItem("notification"));
        console.log(notif);
        return notif ? notif : [];
    }

    function getNotificationUnread() {
        var notif = JSON.parse(localStorage.getItem("notification"));
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
        localStorage.setItem("notification", JSON.stringify(notif));
    }

    function countNotification() {
        var notif = getNotificationUnread();
        return notif.length;
    }


    function removeAllNotification() {
        localStorage.setItem("notification", JSON.stringify([]));
    }


    function getOnlineNotification(user){
        $$.get(app.mainSite + '/api/notice', {cid: user.id}, function (data) {
            data = JSON.parse(data);
            if(data.length > 0){
                current_id_notification = data[0].id;
                $$.get(app.mainSite + '/api/noticeping', {cid: user.id, nid: current_id_notification}, function (data) {

                })
                $$.each(data, function (key, value) {
                    value.unread = true;
                    value["created_at"] = (new Date().getTime() + (+7) * 3600 * 1000)/1000;
                    addNotificationCus(value);
                    if(key == data.length - 1){
                        pubSubModel.emit("new_notification", data);
                        app.f7.addNotification({
                            message: 'there is new member\'s notification',
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