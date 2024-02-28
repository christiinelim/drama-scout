let sessionToken = `acbehdoandduurrbofjsowmeomd` + Math.floor(Math.random() * 100000);
let controlLayers = L.control.layers();
let searchLayers = {};
const groupedLayerControl = L.control.groupedLayers();

document.addEventListener("DOMContentLoaded", async function(){
    // data set
    const data = await loadData();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = Number(urlParams.get('id'));

    displayCardContentPage(data[id]);

    // map
    const map = L.map("map");
    map.setView([37.5519, 126.9918], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    let seoulIcon = L.icon({
        iconUrl: 'image/map/seoul-icon.png',
        iconSize: [15, 35],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
    });
    let seoulMarker = L.marker([37.5519, 126.9918], {icon: seoulIcon});
    seoulMarker.addTo(map);
    seoulMarker.bindPopup(`<h4>Seoul</h4>`);

    // navbar small
    document.querySelector("#menu-button-click").addEventListener("click", function(){
        if (document.querySelector("#dropdown").classList.contains("close")){
            document.querySelector("#dropdown").style.height = "0px";
            document.querySelector("#menu-button-click").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>`;
            document.querySelector("#dropdown").classList.remove("close");
        }
        else{
            document.querySelector("#dropdown").style.height = "99vh";
            document.querySelector("#menu-button-click").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>`;
            document.querySelector("#dropdown").classList.add("close");
        }
    });
    
    // tab
    document.querySelector("#location-list-tab").addEventListener("click", function(){
        // reset location list
        resetLocationList(data[id]);

        document.querySelector("#location-list-tab").style.borderBottom = "2px solid black";
        document.querySelector("#map-tab").style.borderBottom = "";

        // changing tab container
        document.querySelector("#map").style.display = "none";

        document.querySelector("#tab-container").style.removeProperty("position");

        const listElement = document.querySelector("#location-list");
        listElement.classList.remove("shrink");
        listElement.classList.remove("close");

        document.querySelector("#location-nav").classList.remove("location-nav-class");
        document.querySelector("#nav-icon").style.display = "none";
    });

    document.querySelector("#map-tab").addEventListener("click", function(){
        document.querySelector("#map-tab").style.borderBottom = "2px solid black";
        document.querySelector("#location-list-tab").style.borderBottom = "none";

        // changing tab container
        document.querySelector("#map").style.display = "flex";
        document.querySelector("#tab-container").style.position = "relative";
        document.querySelector("#location-list").classList.add("shrink");
        document.querySelector("#location-nav").classList.add("location-nav-class");
        document.querySelector("#nav-icon").style.display = "flex";  

        // create nav tab
        document.querySelector("#mapnav-tab").style.display = "flex";

        renderLocationNav(map, data[id]);

        // clicking on nav-location
        document.querySelector("#mapnav-location-tab").addEventListener("click", function(){
            navLocationEventListener(map, data[id]);
        })

        // clicking on nav-search
        document.querySelector("#mapnav-search-tab").addEventListener("click", function(){
            navSearchEventListener(map, data[id]);
        })
    });

    

    // nav arrow
    document.querySelector("#nav-icon").addEventListener("click", function(){
        if (document.querySelector("#nav-icon").innerHTML == `<i class="bi bi-caret-left-fill"></i>`){
            document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-right-fill"></i>`;
            document.querySelector("#location-list").classList.add("close");
        } else{
            document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
            document.querySelector("#location-list").classList.remove("close");
        }
    });
})


// card content page
function displayCardContentPage(data){
    document.querySelector("#year").innerHTML = data.year;
    document.querySelector("#drama-name").innerHTML = data.drama;
    document.querySelector("#drama-synopsis").innerHTML = data.synopsis;
    document.querySelector("#genre").innerHTML = `<i class="bi bi-tags-fill"></i>${data.genre}`;

    document.querySelector("#drama-image").style.backgroundImage = `url(${data.dramaImage})`;
    let locationLists = renderLocation(data);
    document.querySelector("#location-list").appendChild(locationLists);
}

// generate location list
function renderLocation(data){
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
                    <div class="location-website"><a href=${location.website}></a></div>
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

    return divElement
}

// reset location list
function resetLocationList(data){
    document.querySelector("#location-list").innerHTML = `
        <div>
            <div id="mapnav-tab" class="row">
                <div id="mapnav-location-tab" class="mapnav-tab-item active-tab col-6">Location</div>
                <div id="mapnav-search-tab" class="mapnav-tab-item col-6">Search</div>
            </div>
            <div id="mapnav-container">
            </div>
        </div>
    `;
    let locationLists = renderLocation(data);
    document.querySelector("#location-list").appendChild(locationLists);
}

function renderLocationNav(map, data){
    document.querySelector("#location-list").innerHTML = `
        <div>
            <div id="mapnav-tab" class="row">
                <div id="mapnav-location-tab" class="mapnav-tab-item active-tab col-6">Location</div>
                <div id="mapnav-search-tab" class="mapnav-tab-item col-6">Search</div>
            </div>
            <div id="mapnav-container">
            </div>
        </div>    
    `;

    document.querySelector("#mapnav-tab").addEventListener("click", function(event) {

        
        const target = event.target;
        if (target.id == "mapnav-location-tab") {
            navLocationEventListener(map, data);
        } else if (target.id == "mapnav-search-tab") {
            navSearchEventListener(map, data);
        }
    });

    // display tabs container
    document.querySelector("#mapnav-tab").style.display = "flex";

    renderMapNavItems(map, data);
}


function renderMapNavItems(map, data){
    const divElement = document.querySelector("#mapnav-container");

    // for plotting markers
    let provinceLayers = {};
    
    for (let location of data.location){
        const childElement = createMapNavItem(location);
        divElement.appendChild(childElement);

        const locationMarker = createLocationMarker(location, "drama-location-icon.png", "drama");

        if (!provinceLayers[location.province]) {
            provinceLayers[location.province] = L.layerGroup().addTo(map);
        } 
        
        locationMarker.addTo(provinceLayers[location.province]);

        childElement.querySelector(".mapnav-item-container").addEventListener("click", function(){
            onSearchItemClick(map, location.latitude, location.longitude, locationMarker);
        })
    }

    for (let province in provinceLayers) {
        if (provinceLayers.hasOwnProperty(province)) {
            groupedLayerControl.addOverlay(provinceLayers[province], province, "Drama Locations");
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
                weatherDiv.style.display = "none"
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
        }
    });
}


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
                        <div class="mapnav-location-website"><a href=${location.website}></a></div>    
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

function createLocationMarker(d, url, type){
    let locationMarker = null;

    // plot location icon
    let locationIcon = L.icon({
        iconUrl: `image/map/${url}`,
        iconSize: [40, 40],
        iconAnchor: [22, 94],
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

function createCustomPopup(data, locationMarker){
    // got website
    let websiteDiv = ``;
    if (data.website != "nil"){
        websiteDiv =    `<div class="button-item">
                            <div class="button-item-icon">
                                <a href="${data.website}"><i class="bi bi-link-45deg"></i></a>
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
                        <div class="button-item-icon"><i class="bi bi-signpost-2"></i></div>
                        <div class="button-item-text">Directions</div>
                    </div> 
                    ${websiteDiv}
                    <div class="button-item">
                        <div class="button-item-icon"><i class="bi bi-bookmarks"></i></div>
                        <div class="button-item-text">Save</div>
                    </div>
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

function togglePopupActiveTab(event){
    // add active class style to clicked popup
    event.target.classList.toggle("popup-tab-active");

    // remove from other tab
    const otherPopupTabId = event.target.id == "popup-information" ? "popup-weather" : "popup-information";
    const otherPopupTab = document.getElementById(otherPopupTabId);
    otherPopupTab.classList.remove("popup-tab-active");
}







function renderSearchNav(map, data){
    document.querySelector("#mapnav-location-tab").addEventListener("click", function(){
        navLocationEventListener(map, data);
    })

    // clicking on nav-search
    document.querySelector("#mapnav-search-tab").addEventListener("click", function(){
        navSearchEventListener(map, data);
    })
    
    divElement = document.querySelector("#mapnav-container");
    divElement.innerHTML = ``;

    divElement.innerHTML = `
        <div id="search-category-container">
            <div id="selected-category">Attractions</div>
            <div class="search-category">
                <div id="attractions-pic" class="search-category-icon attractions-pic-active"></div>
                <div class="search-category-name">Attractions</div>
            </div>
            <div class="search-category">
                <div id="art-pic" class="search-category-icon"></div>
                <div class="search-category-name">Art</div>
            </div>
            <div class="search-category">
                <div id="food-pic" class="search-category-icon"></div>
                <div class="search-category-name">Food</div>
            </div>
            <div class="search-category">
                <div id="shopping-pic" class="search-category-icon"></div>
                <div class="search-category-name">Shopping</div>
            </div>
        </div>

        <div id="select-location-container">
            <div id="select-location-icon"><i class="bi bi-geo-alt"></i></div>
            <div id="select-location-dropdown">
                <select id="select-location">
                    <option value="centre">Centre of Map</option>
                    <option value="southkorea">South Korea</option>
                    <option value="seoul">Seoul</option>
                    <option value="busan">Busan</option>
                    <option value="daegu">Daegu</option>
                    <option value="incheon">Incheon</option>
                    <option value="gwangju">Gwangju</option>
                    <option value="daejeon">Daejeon</option>
                    <option value="ulsan">Ulsan</option>
                    <option value="gyeonggido">Gyeonggi-do</option>
                    <option value="gangwondo">Gangwon-do</option>
                    <option value="chungcheongbukdo">Chungcheongbuk-do</option>
                    <option value="chungcheongnamdo">Chungcheongnam-do</option>
                    <option value="jeollabukdo">Jeollabuk-do</option>
                    <option value="jeollanamdo">Jeollanam-do</option>
                    <option value="gyeongsangbukdo">Gyeongsangbuk-do</option>
                    <option value="gyeongsangnamdo">Gyeongsangnam-do</option>
                    <option value="jejudo">Jeju-do</option> 
                </select>
            </div>
        </div>

        <div id="mapnav-searchbar">
            <div id="mapnav-searchbar-border" class="row">
                <div id="mapnav-search-input" class="col-9">
                    <input id="input-text" type="text" placeholder="Search a place"/>
                </div>
                <div id="mapnav-x-icon" class="col-2">
                    <i id="mapnav-x-i" class="bi bi-x-lg"></i>
                </div>
                <div id="mapnav-search-icon" class="col-1">
                    <i class="bi bi-search"></i>
                </div>
            </div>
            <div id="mapnav-search-suggestion">
                <ul id="mapnav-search-suggestion-list"> 
                </ul>
            </div>
            <div id="mapnav-result-box">
            </div>
        </div>
        <div id="error-alert">
            <div id="error-content">
                <div id="error-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
                <div id="error-text">Please give an input</div>
            </div>
        </div>
    `;

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
    /*
    document.querySelector("#input-text").addEventListener("keyup", async function(){
        const latLngSearchLocation = document.querySelector("#select-location").value;
        const searchTerm = document.querySelector("#input-text").value;
        let searchLatLng = null;

        if (latLngSearchLocation == "centre"){
            const centerPoint = map.getBounds().getCenter();
            const searchLatLng = centerPoint.lat + "," + centerPoint.lng;
        } else {
            const provinceLatLng = loadProvinceLatLng();
            const searchLatLng = provinceLatLng[latLngSearchLocation];    
        }

        if (searchTerm != ""){
            const suggestion = await searchTermAutocomplete(searchTerm, searchLatLng, sessionToken);
            getAutocompleteResults(suggestion);
        } else {
            resetSearchField();
        }
       
    }) 
    */
    
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

            if (data.results.length != 0){
                let layerExists = true;
                if (!searchLayers[selectedSearchCategory]) {
                    searchLayers[selectedSearchCategory] = L.layerGroup().addTo(map);
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
                    
                    locationMarker.addTo(searchLayers[selectedSearchCategory]);

                    divElement.querySelector(".mapnav-item-container").addEventListener("click", function(){
                        onSearchItemClick(map, d.geocodes.main.latitude, d.geocodes.main.longitude, locationMarker);
                    })
                }

                // add  layer to the groupedLayerControl if new
                if (!layerExists) {
                    groupedLayerControl.addOverlay(searchLayers[selectedSearchCategory], selectedSearchCategory, "Search");
                    const lastLabel = document.querySelector('#leaflet-control-layers-group-1 label:last-child');
                    // removeLayerButton(map, searchLayers, selectedSearchCategory, lastLabel);
                }

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

    /*
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

            if (data.results.length != 0){
                if (!searchLayers[selectedSearchCategory]) {
                    searchLayers[selectedSearchCategory] = L.layerGroup().addTo(map);
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
                    
                    locationMarker.addTo(searchLayers[selectedSearchCategory]);

                    divElement.querySelector(".mapnav-item-container").addEventListener("click", function(){
                        onSearchItemClick(map, d.geocodes.main.latitude, d.geocodes.main.longitude, locationMarker);
                    })
                }

                let layerExists = false;

                for (let layer of groupedLayerControl._layers) {
                    if (layer.name === selectedSearchCategory) {
                        layerExists = true;
                        break; 
                    }
                }

                // add  layer to the groupedLayerControl if new
                if (!layerExists) {
                    groupedLayerControl.addOverlay(searchLayers[selectedSearchCategory], selectedSearchCategory, "Search");
                } else {
                    map.removeControl(groupedLayerControl);
                    groupedLayerControl.addTo(map);
                }

                // const checkboxes = document.querySelectorAll('.leaflet-control-layers-selector');
                // console.log(checkboxes)

                // checkboxes.forEach(checkbox => {
                //     const label = checkbox.parentNode;
                //     const button = document.createElement('button');
                //     button.className = 'remove-layer-btn';
                //     button.textContent = 'X';
                //     label.appendChild(button);
                
                //     button.addEventListener('click', function(event) {
                //         event.preventDefault(); // Prevent the default behavior of the button
                //         const button = event.target;
                //         const label = button.parentNode;
                //         const checkbox = label.querySelector('.leaflet-control-layers-selector');
                //         checkbox.checked = false;
                //         label.parentNode.removeChild(label); // Remove the entire label
                //     });
                // });

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
    */
}

// toggle layer remove search layer
/*
function removeLayerButton(map, searchLayers, selectedSearchCategory, lastLabel) {
    const checkbox = lastLabel.querySelector('.leaflet-control-layers-selector');
    const label = checkbox.parentNode;
    const buttonDiv = document.createElement('div');
    buttonDiv.className = "remove-layer-div";
    const button = document.createElement('button');
    button.className = "remove-layer-btn";
    button.textContent = 'X';
    buttonDiv.appendChild(button);
    label.appendChild(buttonDiv);

    label.classList.add("search-category-label");

    button.addEventListener('click', function(event) {
        event.preventDefault();
        // const clickedButton = event.target;
        // const buttonDiv = clickedButton.parentNode;
        // const label = buttonDiv.parentNode;
        // const checkbox = label.querySelector('.leaflet-control-layers-selector');

        // // Check if the category layer exists in searchLayers
        // if (searchLayers[selectedSearchCategory]) {
        //     // Remove only the markers associated with the selected category layer
        //     searchLayers[selectedSearchCategory].clearLayers();
        //     delete searchLayers[selectedSearchCategory];
        // }

        // // Remove the label
        // label.parentNode.removeChild(label);
        alert("hello")
    });

    // Toggle visibility of markers when checkbox is checked/unchecked
    checkbox.addEventListener('change', function(event) {
        const isChecked = event.target.checked;
        const selectedCategoryLayer = searchLayers[selectedSearchCategory];
        if (isChecked && selectedCategoryLayer) {
            // Add the layer back to the map
            selectedCategoryLayer.addTo(map);
        } else {
            // Remove the layer from the map
            if (selectedCategoryLayer) {
                map.removeLayer(selectedCategoryLayer);
            }
        }
    });
}
*/













// change icon of nav on click
function changeIcon(divElement, activeClass, inactiveArray){
    divElement.classList.add(`${activeClass}-pic-active`);

    for (let category of inactiveArray){
        document.querySelector(`#${category}-pic`).classList.remove(`${category}-pic-active`);
    }
}

// nav location event listener
function navLocationEventListener(map, data){
    document.querySelector("#mapnav-location-tab").classList.add("active-tab");
    document.querySelector("#mapnav-location-tab").classList.remove("inactive-tab");
    document.querySelector("#mapnav-search-tab").classList.add("inactive-tab");
    document.querySelector("#mapnav-search-tab").classList.remove("active-tab");

    renderLocationNav(map, data);
}

// nav search event listener
function navSearchEventListener(map, data){
    document.querySelector("#mapnav-search-tab").classList.add("active-tab");
    document.querySelector("#mapnav-search-tab").classList.remove("inactive-tab");
    document.querySelector("#mapnav-location-tab").classList.add("inactive-tab");
    document.querySelector("#mapnav-location-tab").classList.remove("active-tab");

    renderSearchNav(map, data);
}

// search item click
function onSearchItemClick(map, lat, lng, locationMarker){
    const adjustedLat = lat + 0.004;
    map.flyTo([adjustedLat, lng], 16);
    locationMarker.openPopup();
    document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-right-fill"></i>`;
    document.querySelector("#location-list").classList.add("close");
}

// autocomplete results
function getAutocompleteResults(suggestion){
    document.querySelector("#mapnav-search-suggestion").style.height = "auto";
    document.querySelector("#mapnav-search-suggestion").style.maxHeight = "200px";
    document.querySelector("#mapnav-search-suggestion").style.border = "1px solid lightgrey";
    document.querySelector("#mapnav-search-suggestion").style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 0px 5px 3px";
    document.querySelector("#mapnav-searchbar-border").style.borderRadius = "10px 10px 0px 0px";
    document.querySelector("#mapnav-searchbar-border").style.boxShadow = "rgba(0, 0, 0, 0.2) -1px -1px 5px 3px";
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

// reset search field
function resetSearchField(){
    document.querySelector("#mapnav-search-suggestion").style.height = "0px";
    document.querySelector("#mapnav-search-suggestion").style.border = "none";
    document.querySelector("#mapnav-search-suggestion").style.removeProperty("box-shadow");
    document.querySelector("#mapnav-searchbar-border").style.borderRadius = "999px";
    document.querySelector("#mapnav-searchbar-border").style.removeProperty("box-shadow");
}
