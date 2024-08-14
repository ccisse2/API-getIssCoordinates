async  function getIssCoordinates() {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cords = await response.json();
    console.log(cords);
  if (cords){
    const { latitude, longitude } = cords.iss_position;
    console.log(`Latitude = ${latitude}, Longitude = ${longitude}`);
    document.getElementById('current-location').innerText = `Latitude = ${latitude}  \n  Longitude = ${longitude}`;
  return {latitude, longitude};
  }
  } catch (error) {
    console.error('Error:', error.message);
  }
}



var map = L.map('map');

getIssCoordinates().then(({ latitude, longitude }) => {
  //L.marker([latitude, longitude]).addTo(map).bindPopup('Current ISS Position').openPopup();
  map.setView([latitude, longitude], 2);
});

L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps/">Google Maps</a>'
}).addTo(map);


var issIcon = L.icon({
  iconUrl: '/img/iss.png',
  iconSize: [50, 50],
  iconAnchor: [25, 25]
})

var issMarker;

function updateIssPosition() {
  getIssCoordinates().then(({ latitude, longitude }) => {
    if (!issMarker) {
      issMarker = L.marker([latitude, longitude], { icon: issIcon }).addTo(map);
    }else{
      issMarker.setLatLng([latitude, longitude]);
    }
    map.setView([latitude, longitude], 2);
  });
}

setInterval(updateIssPosition, 5000);
