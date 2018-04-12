// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    this.firstName = ko.observable("Jack");
    this.lastName = ko.observable("Middlebrook");
    this.fullName = ko.computed(
        function () {
            return this.firstName() + " " + this.lastName();
        }, this
    );
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

// use google maps api to display map of Amsterdam
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.3702, lng: 4.8952},
        zoom: 10
    });
    var centraal = {lat: 52.379189, lng: 4.899431};
    var centraal_marker = new google.maps.Marker({
        position: centraal,
        map: map
    });
}