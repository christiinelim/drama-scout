let sessionToken = `acbehdoandduurrbofjsowmeomd` + Math.floor(Math.random() * 100000);
let controlLayers = L.control.layers();
let polylineLayer = L.layerGroup();
let directionLayer = L.layerGroup();
let searchLayers = {};
const groupedLayerControl = L.control.groupedLayers();
const color = {
    "drama": "#6B5241",
    "attractions": "#628F9F",
    "art": "#646D8D",
    "food": "#A47955",
    "shopping": "#CF8585"
}

document.addEventListener("DOMContentLoaded", async function(){
    // data set
    const data = await loadData();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = Number(urlParams.get('id'));

    displayCardContentPage(data[id]);

    // map
    const map = L.map("map");
    await createMap(map);
    renderMapNavItems(map, data[id]);

    // clicking on nav-location
    document.querySelector("#mapnav-location-tab").addEventListener("click", function(){
        navLocationEventListener();
    })

    // clicking on nav-search
    document.querySelector("#mapnav-search-tab").addEventListener("click", function(){
        navSearchEventListener(map, data[id]);
    })

    // navbar small
    document.querySelector("#menu-button-click").addEventListener("click", function(){
        if (document.querySelector("#dropdown").classList.contains("close")){
            onNavBarOpen();
        }
        else{
            onNavBarClose();
        }
    });
    
    // tab
    document.querySelector("#location-list-tab").addEventListener("click", function(){
        onLocationListTabClick();
    });

    document.querySelector("#map-tab").addEventListener("click", function(){
        mapnavList();
        onMapTabClick();
    });

    // nav arrow
    document.querySelector("#nav-icon").addEventListener("click", function(){
        if (document.querySelector("#nav-icon").innerHTML == `<i class="bi bi-caret-left-fill"></i>`){
            onClosingNavArrow();
        } else{
            onOpeningNavArrow();
        }
    });
    
    // reposition map
    document.querySelector("#reposition-map").addEventListener("click", function(){
        onRepositionMapClick(map);
    })
})

// card content page
function displayCardContentPage(data){
    onDisplayCardContent(data);
    renderLocation(data);
}

// generate location list
function renderLocation(data){
    parentElement = document.querySelector("#location-list-tab-container");
    parentElement.innerHTML = ``;
    divElement = document.createElement("div");
    divElement.classList.add("row");

    for (let location of data.location){
        let childElement = document.createElement("div");

        childElement.innerHTML = `
            <div class="item-container">
                <div class="location-image-container">
                    <div class="location-image"></div>
                </div>

                <div class="rest-contatiner">
                    <div class="location-description-container row">
                        <div class="location-exact col-12 col-md-4">
                            <div class="location-name">${location.name}</div>
                            <div class="location-province">${location.province}, ${location.area}</div>
                        </div>
                        <div class="location-description col-12 col-md-8">${location.description}</div>
                    </div>
                    <div class="location-website"><a href=${location.website} target="_blank"></a></div>
                </div>
            </div>
        `

        if (location.website != "nil"){
            childElement.querySelector("a").innerHTML = `<i class="bi bi-link-45deg"></i>`;
        } else{
            childElement.querySelector(".location-website").innerHTML = `<i class="bi bi-exclamation-circle"></i>
                                                                            <div class="location-no-website">No website available</div>`
            childElement.querySelector(".location-website").addEventListener("mouseover", function(){
                childElement.querySelector(".location-no-website").style.display = "block";
            })

            childElement.querySelector(".location-website").addEventListener("mouseout", function(){
                childElement.querySelector(".location-no-website").style.display = "none";
            })
        };

        childElement.querySelector(".location-image").style.backgroundImage = `url(${location.image})`

        divElement.appendChild(childElement);

    }

    parentElement.appendChild(divElement)
}

// show location list in nav
function renderMapNavItems(map, data){
    const divElement = document.querySelector("#mapnav-location-container");
    divElement.innerHTML = ``;

    // for plotting markers
    let provinceLayers = {};
    let provinceClusters = {};

    for (let location of data.location) {
        const childElement = createMapNavItem(location);
        divElement.appendChild(childElement);

        const locationMarker = createLocationMarker(location, "drama-location-icon.png", "drama");

        if (!provinceLayers[location.province]) {
            provinceLayers[location.province] = L.layerGroup().addTo(map);
        
            provinceClusters[location.province] = L.markerClusterGroup({
                iconCreateFunction: createClusterIcon("image/map/drama-cluster.png")
            });
        
            provinceClusters[location.province].addTo(map);
        }
        
        // add marker to marker cluster group
        provinceClusters[location.province].addLayer(locationMarker);

        childElement.querySelector(".mapnav-item-container").addEventListener("click", function () {
            onSearchItemClick(map, location.latitude, location.longitude, locationMarker);
        });
        
    }

    for (let province in provinceLayers) {
        if (provinceLayers.hasOwnProperty(province)) {
            provinceLayers[province].addLayer(provinceClusters[province]);
        }
    }

    for (let province in provinceLayers) {
        if (provinceLayers.hasOwnProperty(province)) {
            groupedLayerControl.addOverlay(provinceClusters[province], province, "Drama Locations");
        }
    }

    groupedLayerControl.addTo(map);


    // add popup event listener
    document.addEventListener("click", async function(event) {

        if (event.target && event.target.id.startsWith("popup-")) {
            const parentDiv = event.target.parentNode.parentNode;
            const contentDiv = parentDiv.querySelector("#popup-content");
            const informationDiv = contentDiv.querySelector(".information-content");
            const weatherDiv = contentDiv.querySelector(".weather-content");

            togglePopupActiveTab(event);
            
            // show the info of location
            if (event.target.id == "popup-information"){
                informationDiv.style.display = "block";
                weatherDiv.style.display = "none";
            } else { // show the weather
                weatherDiv.style.display = "flex";
                informationDiv.style.display = "none";

                // get weather data
                const lat = contentDiv.querySelector(".location-lat-lng").querySelector(".lat").innerHTML;
                const lng = contentDiv.querySelector(".location-lat-lng").querySelector(".lng").innerHTML;
                const data = await getWeather(lat, lng);
                weatherURL = await getWeatherPhoto(data);

                weatherDiv.querySelector(".weather-summary").innerHTML = `${data.weather[0].description.toUpperCase()}`;
                weatherDiv.querySelector(".weather-icon").style.backgroundImage = `url(${weatherURL})`;
                weatherDiv.querySelector(".weather-temperature").innerHTML = `${data.main.temp}°C`;
                weatherDiv.querySelector(".weather-humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
                weatherDiv.querySelector(".weather-speed").innerHTML = `Wind: ${data.wind.speed}km/h`;
            }
        } else if (event.target && event.target.id == "direction-button"){
            const location = event.target.parentNode.parentNode.parentNode.querySelector(".info-name").innerHTML

            document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
            document.querySelector("#location-list").classList.remove("close");

            // to switch to search tab
            navSearchEventListener(map, data);

            // to switch to direction tab
            document.querySelector("#mapnav-search-container").style.display = "none";
            document.querySelector("#mapnav-direction-container").style.display = "flex";
            
            document.querySelector("#input-text1").value = location;
        }
    });
}

// create individual row of location data
function createMapNavItem(location){
    let childElement = document.createElement("div");

    childElement.innerHTML = `
        <div class="mapnav-item-container row">
            <div class="mapnav-rest-contatiner col-9">
                <div class="mapnav-location-description-container row">
                    <div class="mapnav-location-name">${location.name}</div>
                    <div class="mapnav-location-address">${location.address}</div>
                    <div class="mapnav-province-website">
                        <div class="mapnav-location-province">${location.province}, ${location.area}</div>
                        <div class="mapnav-location-website"><a href=${location.website} target="_blank"></a></div>    
                    </div>
                </div>
            </div>

            <div class="mapnav-location-image-container col-3">
                <div class="mapnav-location-image"></div>
            </div>
        </div>
    `

    if (location.website != "nil"){
        childElement.querySelector("a").innerHTML = `<i class="bi bi-link-45deg"></i>`;
    } else{
        childElement.querySelector(".mapnav-location-website").innerHTML = `<i class="bi bi-exclamation-circle"></i>
                                                                            <div class="mapnav-no-website">No website available</div>`
        childElement.querySelector(".mapnav-location-website").addEventListener("mouseover", function(){
            childElement.querySelector(".mapnav-no-website").style.display = "block";
        })

        childElement.querySelector(".mapnav-location-website").addEventListener("mouseout", function(){
            childElement.querySelector(".mapnav-no-website").style.display = "none";
        })
    };

    childElement.querySelector(".mapnav-location-image").style.backgroundImage = `url(${location.image})`;

    return childElement
}

// create location markers
function createLocationMarker(d, url, type){
    let locationMarker = null;

    // plot location icon
    const iconSize = [40, 40]
    const iconAnchor = [iconSize[0] / 2, iconSize[1] / 2];
    let locationIcon = L.icon({
        iconUrl: `image/map/${url}`,
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: [-3, -76],
    });

    if (type == "drama"){
        locationMarker = L.marker([d.latitude, d.longitude], {icon: locationIcon});
        const data = {
            "lat": d.latitude,
            "lng": d.longitude,
            "image": d.image,
            "name": d.name,
            "website": d.website,
            "category": "Drama Filming Location",
            "address": d.address,
            "open": "Very Likely Open"
        }
        createCustomPopup(data, locationMarker);
    } else {
        locationMarker = L.marker([d.geocodes.main.latitude, d.geocodes.main.longitude], {icon: locationIcon});
        const data = {
            "lat": d.geocodes.main.latitude,
            "lng": d.geocodes.main.longitude,
            "image": d.image,
            "name": d.name,
            "website": "nil",
            "category": d.categories[0].name,
            "address": d.location.formatted_address,
            "open": d.closed_bucket.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
        }
        createCustomPopup(data, locationMarker);
    }

    return locationMarker;
}

// create custom popup for each location marker
function createCustomPopup(data, locationMarker){
    // got website
    let websiteDiv = ``;
    if (data.website != "nil"){
        websiteDiv =    `<div class="button-item">
                            <div class="button-item-icon">
                                <a href="${data.website}" target="_blank"><i class="bi bi-link-45deg"></i></a>
                            </div>
                            <div class="button-item-text">Website</div>
                        </div>`
    } else {
        websiteDiv =    `<div class="button-item">
                            <div class="button-item-icon button-no-website-icon">
                                <i class="bi bi-exclamation-lg"></i>
                            </div>
                            <div class="button-item-text">No Website</div>
                        </div>`;
    }

    // customizing popup
    const customPopup = `
        <div id="popup-tab">
            <div id="popup-information" class="popup-tab-div popup-tab-active"><i class="bi bi-info-circle"></i>INFO</div>
            <div id="popup-weather" class="popup-tab-div"><i class="bi bi-cloud"></i>WEATHER</div>
        </div>
        <div id="popup-content">
            <div class="location-lat-lng">
                <div class="lat">${data.lat}</div>
                <div class="lng">${data.lng}</div>
            </div>
            <div class="information-content">
                <div class="info-image"><img src="${data.image}"/></div>
                <div class="info-name">${data.name}</div>
                <div class="info-button">
                    <div class="button-item">
                        <div id="direction-button" class="button-item-icon"><i class="bi bi-signpost-2"></i></div>
                        <div class="button-item-text">Directions</div>
                    </div> 
                    ${websiteDiv}
                </div>
                <div class="info-description">
                    <div class="description-item">
                        <div class="description-icon"><i class="bi bi-tags"></i></div>
                        <div class="description-text">${data.category}</div>
                    </div> 
                    <div class="description-item">
                        <div class="description-icon"><i class="bi bi-geo-alt"></i></div>
                        <div class="description-text">${data.address}</div>
                    </div>
                    <div class="description-item">
                        <div class="description-icon"><i class="bi bi-clock-history"></i></div>
                        <div class="description-text">${data.open}</div>
                    </div>
                </div>
            </div>
            <div class="weather-content">
                <div class="weather-summary"></div>
                <div class="weather-icon-div"><div class="weather-icon"></div></div>
                <div class="weather-temperature"></div>
                <div class="weather-humidity"></div>
                <div class="weather-speed"></div>
            </div>
        </div>
        `;

    const customOptions =
        {
            'maxWidth': '150px',
            'width': '150px',
            'className' : 'popupCustom'
        };

    locationMarker.bindPopup(customPopup, customOptions);
}

// search tab get results
function renderSearchNav(map, data){
    document.querySelector("#mapnav-location-tab").addEventListener("click", function(){
        navLocationEventListener(map, data);
    })

    // clicking on nav-search
    document.querySelector("#mapnav-search-tab").addEventListener("click", function(){
        navSearchEventListener(map, data);
        document.querySelector("#mapnav-search-container").style.display = "block";
    })
    
    document.querySelector("#attractions-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#attractions-pic");
        changeIcon(divElement, "attractions", ["art", "food", "shopping"]);
        document.querySelector("#selected-category").innerHTML = "Attractions";
    });

    document.querySelector("#art-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#art-pic");
        changeIcon(divElement, "art", ["attractions", "food", "shopping"]);
        document.querySelector("#selected-category").innerHTML = "Art";
    });

    document.querySelector("#food-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#food-pic");
        changeIcon(divElement, "food", ["attractions", "art", "shopping"]);
        document.querySelector("#selected-category").innerHTML = "Food";
    });

    document.querySelector("#shopping-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#shopping-pic");
        changeIcon(divElement, "shopping", ["attractions", "art", "food"]);
        document.querySelector("#selected-category").innerHTML = "Shopping";
    })

    // x icon
    document.querySelector("#mapnav-x-i").addEventListener("click", function(){
        document.querySelector("#input-text").value = ``;
        resetSearchField();
        document.querySelector("#mapnav-result-box").innerHTML = ``;
    })

    // autocomplete search 
    document.querySelector("#input-text").addEventListener("keyup", async function(){
        const latLngSearchLocation = document.querySelector("#select-location").value;
        const searchTerm = document.querySelector("#input-text").value;
        let searchLatLng = null;

        if (latLngSearchLocation == "centre"){
            const centerPoint = map.getBounds().getCenter();
            searchLatLng = centerPoint.lat + "," + centerPoint.lng;
        } else {
            const provinceLatLng = loadProvinceLatLng();
            searchLatLng = provinceLatLng[latLngSearchLocation];    
        }

        if (searchTerm != ""){
            console.log()
            const suggestion = await searchTermAutocomplete(searchTerm, searchLatLng, sessionToken);
            getAutocompleteResults(suggestion);
        } else {
            resetSearchField();
        }
       
    }) 
    
    
    // search icon
    document.querySelector("#mapnav-search-icon").addEventListener("click", async function(){
        const searchTerm = document.querySelector("#input-text").value;
        const selectedSearchCategory = document.querySelector("#selected-category").innerHTML;
        const searchCategoryID = loadSearchCategoryID();
        const searchCategory = searchCategoryID[selectedSearchCategory];

        if (searchTerm == ""){
            document.querySelector("#error-text").innerHTML = "Please give an input";
            document.querySelector("#error-alert").classList.add("visible");
            setTimeout(function(){
                document.querySelector("#error-alert").classList.remove("visible");
            }, 1500);
        } else {
            resetSearchField();
            const latLngSearchLocation = document.querySelector("#select-location").value;
            const resultBoxDiv = document.querySelector("#mapnav-result-box");
            resultBoxDiv.innerHTML = ``;
            let data = null;

            if (latLngSearchLocation == "centre"){
                const centerPoint = map.getBounds().getCenter();
                const searchLatLng = centerPoint.lat + "," + centerPoint.lng;
                data = await search(searchTerm, searchLatLng, searchCategory);
            } else {
                const provinceLatLng = loadProvinceLatLng();
                const searchLatLng = provinceLatLng[latLngSearchLocation];
                data = await search(searchTerm, searchLatLng, searchCategory);      
            }

            const searchClusters = {};

            if (data.results.length != 0){
                let layerExists = true;
                if (!searchLayers[selectedSearchCategory]) {
                    searchLayers[selectedSearchCategory] = L.layerGroup().addTo(map);
                    
                    searchClusters[selectedSearchCategory] = L.markerClusterGroup({
                        iconCreateFunction: createClusterIcon(`image/map/${selectedSearchCategory}-cluster.png`) // Specify the image path here
                    });
                    
                    searchClusters[selectedSearchCategory].addTo(map);
                    layerExists = false;
                }

                for (let d of data.results){
                    divElement = document.createElement("div");
                    divElement.innerHTML = `
                        <div class="mapnav-item-container row">
                            <div class="mapnav-rest-contatiner col-9">
                                <div class="mapnav-location-description-container row">
                                    <div class="mapnav-location-name">${d.name}</div>
                                    <div class="mapnav-location-address">${d.location.formatted_address}</div>
                                    <div class="mapnav-province-website">
                                        <div class="mapnav-location-province">${d.location.region}, ${d.location.post_town} (${d.closed_bucket.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")})</div>
                                    </div>
                                </div>
                            </div>

                            <div class="mapnav-location-image-container col-3">
                                <div class="mapnav-location-image"></div>
                            </div>
                        </div>
                    `
                    resultBoxDiv.appendChild(divElement);

                    const imageResult = await getPhoto(d.fsq_id);
                    let imageURL = "image/map/no-image.png";
                    if (imageResult.length != 0){
                        imageURL = `${imageResult[0].prefix}80x80${imageResult[0].suffix}`;
                        divElement.querySelector(".mapnav-location-image").style.backgroundImage = `url(${imageURL})`;
                        imageURL = `${imageResult[0].prefix}225x140${imageResult[0].suffix}`;
                    } else {
                        divElement.querySelector(".mapnav-location-image").style.backgroundImage = `url(${imageURL})`;
                        imageURL = "image/map/no-image-landscape.png";
                    }

                    // adding image result to d object
                    d.image = imageURL

                    // plot markers
                    const locationMarker = createLocationMarker(d, `${selectedSearchCategory}-marker.png`, "search");
                    
                    locationMarker.addTo(searchClusters[selectedSearchCategory]);

                    divElement.querySelector(".mapnav-item-container").addEventListener("click", function(){
                        onSearchItemClick(map, d.geocodes.main.latitude, d.geocodes.main.longitude, locationMarker);
                    })
                }
                
                // add marker cluster to layer group
                searchLayers[selectedSearchCategory].addLayer(searchClusters[selectedSearchCategory]);

                // add layer to the groupedLayerControl if new
                if (!layerExists) {
                    groupedLayerControl.addOverlay(searchLayers[selectedSearchCategory], selectedSearchCategory, "Search");
                }

                // add popup event listener
                document.addEventListener("click", async function(event) {

                    if (event.target && event.target.id == "direction-button"){
                        const location = event.target.parentNode.parentNode.parentNode.querySelector(".info-name").innerHTML

                        document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
                        document.querySelector("#location-list").classList.remove("close");

                        // to switch to search tab
                        navSearchEventListener(map, data);

                        // to switch to direction tab
                        document.querySelector("#mapnav-search-container").style.display = "none";
                        document.querySelector("#mapnav-direction-container").style.display = "flex";
                        
                        document.querySelector("#input-text1").value = location;
                    }
                });
            } else{
                document.querySelector("#error-text").innerHTML = "Sorry no match found";
                document.querySelector("#error-alert").classList.add("visible");
                setTimeout(function(){
                    document.querySelector("#error-alert").classList.remove("visible");
                }, 1500);
            }
        }

        sessionToken = `acbehdoandduurrbofjsowmeomd` + Math.floor(Math.random() * 100000);
    })

    // direction icon
    document.querySelector("#mapnav-direction-icon").addEventListener("click", function(){
        onDirectionClick();
    })

    // direction x icon
    document.querySelector("#mapnav-direction-x-icon").addEventListener("click", function(){
        onDirectionExit();
    })

    // direction search icon
    document.querySelector("#mapnav-direction-icon2").addEventListener("click", async function(){
        const start = document.querySelector("#input-text1").value;
        const end = document.querySelector("#input-text2").value;
        const profile = document.querySelector("#select-type").value;

        if (start == "" | end == ""){
            document.querySelector("#error-text2").innerHTML = "Please give an input";
            document.querySelector("#error-alert2").classList.add("visible");
            setTimeout(function(){
                document.querySelector("#error-alert2").classList.remove("visible");
            }, 1500);
        }
        else {
            if (map.hasLayer(polylineLayer)){
                polylineLayer.removeFrom(map);
                polylineLayer.clearLayers();
                directionLayer.removeFrom(map);
                directionLayer.clearLayers();
            }
            const starting = await convertPlaceToLatLong(start);
            addDirectionMarker(map, "starting-point", starting[1], starting[0], directionLayer);
            const ending = await convertPlaceToLatLong(end);
            addDirectionMarker(map, "ending-point", ending[1], ending[0], directionLayer);
            const routeInformation = await loadDirections(starting, ending, profile); 

            const encoded = routeInformation.routeGeometry;

            const polyline = L.Polyline.fromEncoded(encoded,{
                color: '#1B85E6',
                weight: 5
            });

            polylineLayer.addLayer(polyline).addTo(map);

            map.fitBounds(polyline.getBounds());

            document.querySelector("#direction-result").style.display = "block";
            document.querySelector("#direction-duration").innerHTML = `Duration: ${routeInformation.duration} minutes`;
            document.querySelector("#direction-distance").innerHTML = `Duration: ${routeInformation.distance} km`;

            const divElement = document.querySelector("#direction-steps");
            divElement.innerHTML = ``;

            for (let step of routeInformation.directions) {
                const childElement = document.createElement('div');
                childElement.classList.add('step-list');
                childElement.classList.add('row');
                childElement.innerHTML = `
                    <div class="step-photo-container col-2"><div class="step-photo" style="background-image: url('${step.image}')"></div></div>
                    <div class="step-description col-8">${step.step}</div>
                    <div class="step-distance-container col-2">
                        <div class="step-distance">${step.distance}</div>
                    </div>
                `;
                divElement.appendChild(childElement);
                childElement.querySelector(".step-photo").style.imageURL = `${step.image}`
            }
        }
    });    
}

// autocomplete results
function getAutocompleteResults(suggestion){
    onSearchAutoComplete();
    parentElement = document.querySelector("#mapnav-search-suggestion-list");
    parentElement.innerHTML = ``;

    for (let s of suggestion.results){
        childElement = document.createElement("li");
        childElement.innerHTML = `${s.place.name}`;
        parentElement.appendChild(childElement);

        childElement.addEventListener("click", function(){
            document.querySelector("#input-text").value = `${s.place.name}`;
            resetSearchField();
        })
    }
}
