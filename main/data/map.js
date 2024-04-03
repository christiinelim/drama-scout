function createMap(map){
    map.setView([37.5519, 126.9918], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    const iconSize = [15, 35]
    const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2];
    let seoulIcon = L.icon({
        iconUrl: 'image/map/seoul-icon.png',
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: [-3, -76],
    });
    let seoulMarker = L.marker([37.5519, 126.9918], {icon: seoulIcon});
    seoulMarker.addTo(map);

    const customOptions =
        {
            'className' : 'seoulCustom'
        };

    seoulMarker.bindPopup(`<h6>SEOUL</h6>`, customOptions);
}

// change icon of nav on click
function changeIcon(divElement, activeClass, inactiveArray){
    divElement.classList.add(`${activeClass}-pic-active`);

    for (let category of inactiveArray){
        document.querySelector(`#${category}-pic`).classList.remove(`${category}-pic-active`);
    }
}

// direction icon customization
function addDirectionMarker(map, image, lat, lng, layer){
    const iconSize = [35, 35]
    const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2];
    let customizedIcon = L.icon({
        iconUrl: `image/map/${image}.png`,
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: [-3, -76],
    });
    let newMarker = L.marker([lat, lng], {icon: customizedIcon});

    layer.addLayer(newMarker).addTo(map);
}


// marker cluster icon customization
function createClusterIcon(iconImagePath) {
    return function (cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
            className: 'custom-cluster-icon', 
            html: `<div class="custom-cluster-icon-content"><img src="${iconImagePath}" /><span class="cluster-count">${count}</span></div>`,
            iconSize: [40, 40]
        });
    };
}


// reposition map
function onRepositionMapClick(map){
    map.flyTo([37.5519, 126.9918], 13);
}


// search item click
function onSearchItemClick(map, lat, lng, locationMarker){
    const adjustedLat = lat + 0.004;
    map.flyTo([adjustedLat, lng], 16);
    locationMarker.openPopup();
    onClosingNavArrow();
}