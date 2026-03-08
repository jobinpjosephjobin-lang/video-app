const API_KEY = "724bac074007bc29092fc265866757b1";

const map = L.map('map').setView([20,0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map);

let planeMarkers = [];


/* plane icon */
function createPlaneIcon(rotation){

return L.divIcon({
className:"",
html:`<img class="plane-icon" 
style="transform:rotate(${rotation}deg)" 
src="https://cdn-icons-png.flaticon.com/512/34/34627.png">`,
iconSize:[30,30]
});
}


/* get flights */

async function loadFlights(){

const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}`;

const res = await fetch(url);
const data = await res.json();

planeMarkers.forEach(m=>map.removeLayer(m));
planeMarkers=[];

data.data.forEach(flight=>{

if(!flight.live) return;

let lat = flight.live.latitude;
let lon = flight.live.longitude;
let dir = flight.live.direction || 0;

let marker = L.marker(
[lat,lon],
{icon:createPlaneIcon(dir)}
).addTo(map);

marker.bindPopup(`
<div class="popup">
<b>Flight:</b> ${flight.flight.iata || "N/A"}<br>
<b>Airline:</b> ${flight.airline.name}<br>
<b>From:</b> ${flight.departure.airport}<br>
<b>To:</b> ${flight.arrival.airport}<br>
<b>Altitude:</b> ${flight.live.altitude} ft<br>
<b>Speed:</b> ${flight.live.speed_horizontal} km/h
</div>
`);

planeMarkers.push(marker);

});

}

/* user location */

function locateUser(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(pos=>{

let lat = pos.coords.latitude;
let lon = pos.coords.longitude;

map.setView([lat,lon],6);

L.marker([lat,lon])
.addTo(map)
.bindPopup("Your Location")
.openPopup();

});

}

}

/* refresh every 15 sec */

setInterval(loadFlights,15000);

locateUser();
loadFlights();
