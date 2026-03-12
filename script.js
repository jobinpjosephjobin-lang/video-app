const map = L.map("map").setView([20,0],3);



/* MAP LAYERS */

const normalMap = L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:19
});

const satelliteMap = L.tileLayer(
"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
{
maxZoom:19
});

normalMap.addTo(map);

L.control.layers({
"Normal Map":normalMap,
"Satellite":satelliteMap
}).addTo(map);



/* PLANE ICON */

const planeIcon = L.icon({
iconUrl:"plane.png",
iconSize:[60,60],
iconAnchor:[30,30],
className:"planeIcon"
});



let planes = {};



async function fetchFlights(){

try{

let response = await fetch(
"https://opensky-network.org/api/states/all"
);

let data = await response.json();

let flights = data.states;

flights.forEach(f=>{

let id = f[0];
let lon = f[5];
let lat = f[6];
let velocity = f[9];
let heading = f[10];

if(!lat || !lon) return;



if(!planes[id]){

let marker = L.marker(
[lat,lon],
{
icon:planeIcon,
rotationAngle: heading || 0
}
).addTo(map);

planes[id]={
marker:marker,
lat:lat,
lon:lon,
velocity:velocity,
heading:heading
};

}

else{

animatePlane(planes[id],lat,lon,heading);

}

});

}

catch(e){

console.log("API error",e);

}

}



function animatePlane(plane,newLat,newLon,newHeading){

let startLat = plane.lat;
let startLon = plane.lon;

let steps = 40;
let frame = 0;



function move(){

frame++;

let lat = startLat + (newLat-startLat)*(frame/steps);
let lon = startLon + (newLon-startLon)*(frame/steps);

plane.marker.setLatLng([lat,lon]);

if(newHeading){
plane.marker.setRotationAngle(newHeading);
}

if(frame < steps){

requestAnimationFrame(move);

}

else{

plane.lat = newLat;
plane.lon = newLon;

}

}

move();

}



/* REFRESH DATA */

setInterval(fetchFlights,5000);

fetchFlights();
