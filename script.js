const map = L.map("map").setView([20,0],3);



/* ---------- MAP LAYERS ---------- */

const normal = L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{maxZoom:19}
);

const satellite = L.tileLayer(
"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
{maxZoom:19}
);

normal.addTo(map);

L.control.layers({
"Normal":normal,
"Satellite":satellite
}).addTo(map);



/* ---------- PLANE ICON ---------- */

const planeIcon = L.icon({
iconUrl:"plane.png",
iconSize:[60,60],
iconAnchor:[30,30],
className:"planeIcon"
});



let planes = {};



/* ---------- FETCH FLIGHT DATA ---------- */

async function fetchFlights(){

try{

let response = await fetch(
"https://corsproxy.io/?https://opensky-network.org/api/states/all"
);

let data = await response.json();

if(!data.states) return;

data.states.forEach(f=>{

let id = f[0];
let lon = f[5];
let lat = f[6];
let velocity = f[9] || 0;
let heading = f[10] || 0;

if(!lat || !lon) return;



if(!planes[id]){

let marker = L.marker(
[lat,lon],
{
icon:planeIcon,
rotationAngle:heading
}).addTo(map);

planes[id]={
marker:marker,
lat:lat,
lon:lon,
targetLat:lat,
targetLon:lon,
velocity:velocity,
heading:heading
};

}

else{

planes[id].targetLat = lat;
planes[id].targetLon = lon;
planes[id].velocity = velocity;
planes[id].heading = heading;

}

});

}

catch(e){

console.log("API error",e);

}

}



/* ---------- SMOOTH ANIMATION ENGINE ---------- */

function animate(){

Object.values(planes).forEach(p=>{

let dx = p.targetLat - p.lat;
let dy = p.targetLon - p.lon;

p.lat += dx * 0.02;
p.lon += dy * 0.02;

p.marker.setLatLng([p.lat,p.lon]);

p.marker.setRotationAngle(p.heading);

});

requestAnimationFrame(animate);

}

animate();



/* ---------- UPDATE DATA ---------- */

setInterval(fetchFlights,15000);

fetchFlights();
