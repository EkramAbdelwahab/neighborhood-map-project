var map;
var res = "";
var locName = "";
var lat, lng;

//handelling error 
function GoogleMapErrorHandling() {
	alert("Error loading Google Maps");
}

function ViewModel(favorList)
{
//var ViewModel = function(favorList) {
	var that = this;
	this.isVisible = ko.observable(true);
	this.locName = favorList.locTitle;
	this.lat = favorList.lat;
	this.lng = favorList.lng;
	
	//creating markers for every place
	var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
	that.marker = new google.maps.Marker({
		position: new google.maps.LatLng(favorList.lat, favorList.lng),
		map: map,
		icon: image
	});
	//Add click listener to the marker
	that.marker.addListener('click', function() {

		that.winContent = '<div><b>' + 'Location: ' + that.locName + "</b></div>" +
			'<div>' + 'location(lat,long): ' + that.lat + ',' + that.lng + "</div>";
		
		that.InfoWin.setContent(that.winContent);
		that.InfoWin.open(map, this);
	});
	this.marker.addListener('mouseover', that.changeMarkerIcon);
	
//creating infowindow and setting its content
	var winContent = '<div><b>' + that.locName + "</b></div>" +
			'<div>' + that.lat + ',' + that.lng + "</div>";
	this.InfoWin = new google.maps.InfoWindow({Content: that.winContent});
	 
// bouncing marker
	this.toggleBounce = function(place) {
		google.maps.event.trigger(that.marker, 'click');
	};
};


function startMap () {

	var that = this;
	//initializing my favourite locatios 
	var favoritLocatios = [
		{locTitle: 'Evil Tour',lat: 48.858603, lng: 2.294438},
		{locTitle: 'Tag Mahal India', lat: 27.175263, lng: 78.042134},
		{locTitle: 'New Delhi', lat: 28.631534, lng: 77.207622},
		{locTitle: 'University of California', lat: 34.103714, lng: -118.455636},
		{locTitle: 'China Great Wall', lat: 40.431908, lng: 116.570332},
		{locTitle: 'Milano. Italy', lat:45.467464, lng: 9.188042},
		{locTitle: 'sursock museum', lat: 33.894435, lng: 35.516237}
	];

	this.searchForPlace = ko.observable("");
	this.locList = ko.observableArray([]);
	//initializing map;
	var cent = {lat: 34.103714, lng: -118.455636};
	var myMap = document.getElementById('map');
	myMap.style.height = window.innerHeight-50;
	map = new google.maps.Map(myMap, {
		center: cent, 
		zoom: 4
	});
	//looping on the list of locatios
	favoritLocatios.forEach(function(loc_Item) {
		that.locList.push(new ViewModel(loc_Item));
	
	});
	
	this.myList = ko.computed(function() {
		var place = that.searchForPlace().toLowerCase();
		if(!place) {
			that.locList().forEach(function(loc_Item) {
				loc_Item.isVisible(true);
			});
			return that.locList();
		}
		else {
			return ko.utils.arrayFirst(that.locList(), function(loc_Item) {
				var str = loc_Item.locName.toLowerCase();
				var res = (str.search(place) >= 0);
				loc_Item.isVisible(res);
				return res;
			
			});
		}
	
	}, that);

}

//start application function	
function showMap() {
	ko.applyBindings(new startMap());
	}
