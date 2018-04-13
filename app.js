// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    this.firstName = ko.observable("Jack");
    this.lastName = ko.observable("Middlebrook");
    this.fullName = ko.computed(
        function () {
            return this.firstName() + " " + this.lastName();
        }, this
    );
    this.museums = ko.observableArray([
        {title: 'Rijksmuseum', location: {lat: 52.3600, lng: 4.8852}},
        {title: 'Van Gogh Museum', location: {lat: 52.3584, lng: 4.8811}},
        {title: 'Joods Historisch Museum', location: {lat: 52.3671, lng: 4.9038}},
        {title: 'Fotografiemuseum Amsterdam', location: {lat: 52.3641, lng: 4.8933}},
        {title: 'Stedelijk Museum', location: {lat: 52.3580, lng: 4.8798}},
        {title: 'Hermitage Museum', location: {lat: 52.3653, lng: 4.9024}},
        {title: 'Museum het Rembrandthuis', location: {lat: 52.3694, lng: 4.9012}},
        {title: 'Allard Pierson Museum', location: {lat: 52.3687, lng: 4.8930}},
        {title: 'Tropenmuseum', location: {lat: 52.3627, lng: 4.9223}}
    ])

}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

// use google maps api to display map of Amsterdam
var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.3702, lng: 4.8952},
        zoom: 13
    });

    // list of amsterdam museums with coordinates
    var museums = [
        {title: 'Rijksmuseum', location: {lat: 52.3600, lng: 4.8852}},
        {title: 'Van Gogh Museum', location: {lat: 52.3584, lng: 4.8811}},
        {title: 'Joods Historisch Museum', location: {lat: 52.3671, lng: 4.9038}},
        {title: 'Fotografiemuseum Amsterdam', location: {lat: 52.3641, lng: 4.8933}},
        {title: 'Stedelijk Museum', location: {lat: 52.3580, lng: 4.8798}},
        {title: 'Hermitage Museum', location: {lat: 52.3653, lng: 4.9024}},
        {title: 'Museum het Rembrandthuis', location: {lat: 52.3694, lng: 4.9012}},
        {title: 'Allard Pierson Museum', location: {lat: 52.3687, lng: 4.8930}},
        {title: 'Tropenmuseum', location: {lat: 52.3627, lng: 4.9223}}
    ];

    var largeInfowindow = new google.maps.InfoWindow();

    // default marker icon for museums
    var defaultIcon = makeMarkerIcon('0091ff');

    var highlightedIcon = makeMarkerIcon('ffff24');



    // The following group uses the museum array to create an array of markers on initialize.
    for (var i = 0; i < museums.length; i++) {
        // Get the position from the location array.
        var position = museums[i].location;
        var title = museums[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            // populateInfoWindow(this, largeInfowindow);
            for (var i = 0; i < markers.length; i++) {
                if (this.id !== markers[i].id) {
                    markers[i].setIcon(defaultIcon);
                }
            }
            if (this.getIcon().url === defaultIcon.url) {
                this.setIcon(highlightedIcon);
                populateInfoWindow(this, largeInfowindow);
            } else {
                this.setIcon(defaultIcon);
                largeInfowindow.marker = null;
                largeInfowindow.close();
            }
        });


    }

    document.getElementById('show-museums').addEventListener('click', showMuseums);
    document.getElementById('hide-museums').addEventListener('click', hideMuseums);

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}

function showMuseums() {
    var bounds = new google.maps.LatLngBounds();
    // for each museum extend the boundaries and display marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

function hideMuseums() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}
