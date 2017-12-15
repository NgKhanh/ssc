define(["app"], function(app){

    function loginUser(user){
        localStorage.setItem("user", JSON.stringify(user));
    }

    function signoutUser(){
        var user = isUserLogin();
        localStorage.setItem("lastUser", user[0]["email"]);
        localStorage.setItem("user", null);
    }

    function isUserLogin(){
        var userArr = JSON.parse(localStorage.getItem("user"));
        return userArr;
    }

    function updateUser(obj){
        var userArr = JSON.parse(localStorage.getItem("user"));
        userArr[0].name = obj.name;
        userArr[0].contact = obj.contact;
        localStorage.setItem("user", JSON.stringify(userArr));
    }

    function getLastUser(){
        return localStorage.getItem("lastUser");
    }

    return {
        loginUser: loginUser,
        signoutUser: signoutUser,
        isUserLogin: isUserLogin,
        updateUser: updateUser,
        getLastUser: getLastUser
    };
});