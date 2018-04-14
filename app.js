// to store google maps api
var map;

// List of museums
var museums = [
    {title: 'Rijksmuseum', location: {lat: 52.3600, lng: 4.8852}},
    {title: 'Van Gogh Museum', location: {lat: 52.3584, lng: 4.8811}},
    {title: 'Joods Historisch Museum', location: {lat: 52.3671, lng: 4.9038}},
    {title: 'FOAM Fotografiemuseum Amsterdam', location: {lat: 52.3641, lng: 4.8933}},
    {title: 'Stedelijk Museum', location: {lat: 52.3580, lng: 4.8798}},
    {title: 'Hermitage Museum', location: {lat: 52.3653, lng: 4.9024}},
    {title: 'Rembrandt House Museum', location: {lat: 52.3694, lng: 4.9012}},
    {title: 'Allard Pierson Museum', location: {lat: 52.3687, lng: 4.8930}},
    {title: 'Tropenmuseum', location: {lat: 52.3627, lng: 4.9223}}
];


function AppViewModel() {
    self = this;

    this.searchMuseum = ko.observable("");

    this.museumList = ko.computed(function () {
        var filter = self.searchMuseum().toLowerCase();
        if (!filter) {
            for (var i = 0; i < museums.length; i++) {
                if (map) {
                    museums[i].marker.setVisible(true);
                }
            }
            return museums;
        } else {
            return ko.utils.arrayFilter(museums, function (museum) {
                if (!museum.title.toLowerCase().includes(filter)) {
                    // hide the marker if museum not in search
                    museum.marker.setVisible(false);
                }
                return museum.title.toLowerCase().includes(filter);
            });
        }
    }, this);

    this.museumClick = function() {
        google.maps.event.trigger(this.marker, 'click');
    }
}

// Activates knockout.js
var viewModel = new AppViewModel();
ko.applyBindings(viewModel);

function initMap() {
    // use google maps api to display map of Amsterdam
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.3702, lng: 4.8952},
        zoom: 13,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#263c3f'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6b9a76'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#38414e'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
            },
            {
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ]
    });

    // for updating the info window of locations
    var largeInfowindow = new google.maps.InfoWindow();
    // Marker icon for museums
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('ffff24');
    // bounds for map
    var bounds = new google.maps.LatLngBounds();
    // create markers for each location
    for (var i = 0; i < museums.length; i++) {
        // Get the position from the location array.
        var position = museums[i].location;
        var title = museums[i].title;
        // museum title for wiki query
        var museum_title = title.split(" ").join("+");
        // retrieves wikipedia info
        var wiki_url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + museum_title + "&format=json&callback=wikiCallback";
        // use wikipedia api to get summary and link to wiki article
        getWikiData(museums[i], wiki_url);
        // Create a marker for each museum
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            map: map,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // add the marker to the museum array
        museums[i].marker = marker;

        // fit the bounds of the map to the markers
        bounds.extend(museums[i].marker.position);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function () {
            for (var i = 0; i < museums.length; i++) {
                if (this.id !== museums[i].marker.id) {
                    museums[i].marker.setIcon(defaultIcon);
                }
            }
            if (this.getIcon().url === defaultIcon.url) {
                this.setIcon(highlightedIcon);
                populateInfoWindow(this, largeInfowindow, defaultIcon);
            } else {
                this.setIcon(defaultIcon);
                largeInfowindow.marker = null;
                largeInfowindow.close();
            }
        });
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow, defaultIcon) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        var info_content = '<h1>' + marker.title + '</h1>';
        info_content += '<div>' + museums[marker.id].wiki_summary + '</div>';
        info_content += '<p><a href="' + museums[marker.id].wiki_link + '" target="_blank">Wikipedia</p>';
        infowindow.setContent(info_content);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
            marker.setIcon(defaultIcon);
        });
    }
}


function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function getWikiData(museum, wiki_url) {
    $.ajax( {
        url: wiki_url,
        dataType: 'jsonp',
        success: function(data) {
            var wiki_summary = data[2][0];
            var wiki_link = data[3][0];
            museum.wiki_summary = wiki_summary;
            museum.wiki_link = wiki_link;
        }
    } );
}
