define(["app", 'hbs!js/panel-left/panel-left-view'], function(app, template) {
    var $ = Framework7.$;

    function render(params) {
        $("#section-welcome").html(template({
            user: params.isLogin,
            numbNotificationUnread: params.numbNotificationUnread
        }));
        $("#section-nav-normal .numb-notif").html(params.numbPublicNotificationUnread);

        bindEvents(params.bindings);
        $(".return-home").click(function(e){
            e.preventDefault();
            if(app.mainView.activePage.name == "index"){
                return;
            }
            else{
                app.mainView.router.load({
                    url: "index.html"
                })
            }
        })

        updateElement();
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    function updateElement(){
        $.get(app.mainSite + '/api/content/option', {key: "mobile_number"}, function (data) {
            data = JSON.parse(data);
            $(".call-us").attr("data-href", "tel:" + data[0].value);
            $(".sms-us").attr("data-href", "tel:" + data[0].value);
        });
    }

    return{
        render: render
    }
});