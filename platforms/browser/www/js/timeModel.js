define(function(){
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    function changeFormatTime(string) {
        var date = new Date(string.replace(/-/g, '/'));
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return year + ', ' + monthNames[monthIndex] + ' ' + day;
    }

    function timeUpload(time) {
        var diff = ((new Date().getTime() + (+7) * 3600 * 1000)/1000) - time;
//        console.log(unixtime);
//        console.log((new Date().getTime() + (+7) * 3600 * 1000)/1000);
        var timeString;

        if(diff > 3600 * 24){

            var date = new Date(1000*time);
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            timeString = year + ', ' + monthNames[monthIndex] + ' ' + day;
        }
        else{
            if(diff > 3600){
                timeString = Math.ceil(diff/(60 * 24)) + " hour ago";
            }
            else{
                timeString = Math.ceil(diff/60) + " minute ago";
            }
        }

        return timeString;
    }

    return{
        timeUpload: timeUpload,
        changeFormatTime: changeFormatTime
    }
})