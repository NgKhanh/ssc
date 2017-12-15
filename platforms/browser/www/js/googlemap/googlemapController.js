define(["app", "js/googlemap/googlemapView"], function (app, googlemapView) {

    app.f7.onPageAfterAnimation('googlemap', function (page) {
        var address = Object.assign({}, page.context);
        var lat, lng;
        if (address.lat && address.lng) {
            lat = address.lat;
            lng = address.lng
        }
        address = address.address;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode(
            { 'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                        if (!lat)
                            lat = results[0].geometry.location.lat(); //getting the lat
                        if (!lng)
                            lng = results[0].geometry.location.lng(); //getting the lng


                        var latlng = new google.maps.LatLng(lat, lng);

                        var mapProp = {
                            center: latlng,
                            zoom: 17,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var map = new google.maps.Map(document.getElementById('googleMap'), mapProp);

                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: address
                        });

                        marker.setMap(map);

                    } else {
                        alert("No results found");
                    }
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });


    });

    function init() {
        googlemapView.render();
    }

    return {
        init: init
    };
});
