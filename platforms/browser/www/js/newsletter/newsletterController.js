define(["app", "js/newsletter/newsletterView"], function (app, NewsletterView) {
    var $ = Framework7.$;
    var $$ = Dom7;
    var newsletter;
    var bindings = [
        {
            element: '.subcribe',
            event: 'click',
            handler: subcribe
        }
    ];

    function init() {
        NewsletterView.render({
            bindings: bindings
        });
    }

    function subcribe(){
        var formInput = app.f7.formToJSON('#newsletter-form');

        if (formInput.name.trim() == "" || formInput.email.trim() == "") {
            app.f7.alert("<p>Please don't send blank text</p>", "Subscribe Fail");
        }
        else if(!formInput.email.checkEmail()){
            app.f7.alert("<p>Invalid Email</p>", "Subscribe Fail");
        }
        else {
            $.get(app.mainSite + '/api/sendmails', {sendto: formInput.email, subject: "", contents: formInput.name}, function (data) {
                data = JSON.parse(data);
                if (data == "Sending success") {
                    $$("#newsletter-form .reset-form").click();
                    app.f7.addNotification({
                        message: 'SEND SUCCESS',
                        hold: 2000,
                        closeIcon: false
                    });
                }
                else {
                    app.f7.alert("<p>Invalid Email</p>", "Subscribe Fail");
                }

            });
        }
    }

    return {
        init: init
    };
});
