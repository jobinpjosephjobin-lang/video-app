const map = L.map('map').setView([20,0],3);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

let aircraftMarkers = [];

function createPlane(rotation){

return L.divIcon({

className:"",

html:`<img 
class="plane"
src="https://cdn-icons-png.flaticon.com/512/34/34627.png"
style="transform:rotate(${rotation}deg)">`,

iconSize:[26,26]

});

}

async function loadFlights(){

const response = await fetch(
"https://opensky-network.org/api/states/all"
);

const data = await response.json();

aircraftMarkers.forEach(m=>map.removeLayer(m));
aircraftMarkers=[];

data.states.forEach(flight=>{

const lon = flight[5];
const lat = flight[6];
const altitude = flight[7];
const velocity = flight[9];
const direction = flight[10];
const callsign = flight[1];
const country = flight[2];

if(!lat || !lon) return;

let marker = L.marker(
[lat,lon],
{icon:createPlane(direction || 0)}
).addTo(map);

marker.bindPopup(

`
<b>Flight:</b> ${callsign || "Unknown"}<br>
<b>Country:</b> ${country}<br>
<b>Altitude:</b> ${altitude || "N/A"} m<br>
<b>Speed:</b> ${velocity || "N/A"} m/s
`

);

aircraftMarkers.push(marker);

});

}

function getUserLocation(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(pos=>{

const lat = pos.coords.latitude;
const lon = pos.coords.longitude;

map.setView([lat,lon],6);

L.marker([lat,lon])
.addTo(map)
.bindPopup("📍 Your Location")
.openPopup();

});

}

}

loadFlights();
getUserLocation();

setInterval(loadFlights,15000);
