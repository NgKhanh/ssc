define(["app", "js/notification-detail-public/notification-detail-publicView", "js/notificationPublicModel", "js/pubsubModel", "js/timeModel"],
    function (app, NotificationDetailView, NotificationModel, pubSubModel, TimeModel) {
    var $ = Framework7.$;
    var myApp = app.f7;
    var status = "empty";
    var eNotification;
    var bindings = [
        {
            element: '.delete-message',
            event: 'click',
            handler: removeMessage
        }
    ];

    function init(query) {
        var notification = NotificationModel.getNotification();
        eNotification = notification[query["index"]];
        eNotification["upload_time"] = TimeModel.timeUpload(eNotification.created_at);
        eNotification["index"] = query["index"];
        NotificationDetailView.render({
            bindings: bindings,
            status: status,
            eNotification: eNotification
        });
    }

    function removeMessage(e) {
        e.preventDefault();
        NotificationModel.removeNotification(eNotification["index"]);

        myApp.addNotification({
            message: 'Notification was deleted',
            hold: 2000,
            onClose: removeCallback,
            closeIcon: false
        });
    }

    function removeCallback() {
        pubSubModel.emit("deletePublicNotification", eNotification.index);
        app.mainView.router.back();
    }

    return {
        init: init
    };
});
