const map = L.map('map',{
zoomControl:false
}).setView([20,0],3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:10
}).addTo(map);

const planeIcon = L.icon({
iconUrl:"plane.png",
iconSize:[50,50],
iconAnchor:[25,25]
});

let planes={};

async function getFlights(){

let res = await fetch("https://opensky-network.org/api/states/all");

let data = await res.json();

data.states.forEach(f =>{

let id = f[0];
let lat = f[6];
let lon = f[5];
let velocity = f[9];
let heading = f[10];

if(!lat || !lon) return;

if(!planes[id]){

let marker = L.marker([lat,lon],{
icon:planeIcon
}).addTo(map);

planes[id]={
marker:marker,
lat:lat,
lon:lon,
velocity:velocity,
heading:heading
};

}else{

planes[id].velocity = velocity;
planes[id].heading = heading;

predictAndAnimate(planes[id],lat,lon);

}

});

}

function predictAndAnimate(plane,newLat,newLon){

let startLat = plane.lat;
let startLon = plane.lon;

let steps = 30;
let i = 0;

function animate(){

i++;

let lat = startLat + (newLat-startLat)*(i/steps);
let lon = startLon + (newLon-startLon)*(i/steps);

plane.marker.setLatLng([lat,lon]);

if(i<steps){
requestAnimationFrame(animate);
}else{
plane.lat=newLat;
plane.lon=newLon;
}

}

animate();
}

setInterval(getFlights,5000);

getFlights();
