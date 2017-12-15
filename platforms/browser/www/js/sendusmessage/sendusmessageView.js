define(['hbs!js/sendusmessage/sendusmessage-view', 'app'], function (template, app) {
    var $ = Framework7.$;

    function render(params) {
        $("#sendusmessage-template").html(template({
            user: params.user
        }));

        resetCaptcha();
        bindEvents(params.bindings);
        app.activeFocusInput($("#txtInput"));
        app.activeFocusInput($("textarea"));
    }

    function resetCaptcha(){
        //captcha
        //Generates the captcha function
        var a = Math.ceil(Math.random() * 9) + '';
        var b = Math.ceil(Math.random() * 9) + '';
        var c = Math.ceil(Math.random() * 9) + '';
        var d = Math.ceil(Math.random() * 9) + '';
        var e = Math.ceil(Math.random() * 9) + '';


        var code = a + b + c + d + e;
        $("#txtCaptcha").val(code);
        $("#txtCaptchaDiv").html(code);
    }

    function bindEvents(bindings) {
        for (var i in bindings) {
            $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    }

    return {
        render: render,
        resetCaptcha: resetCaptcha
    };
})
;