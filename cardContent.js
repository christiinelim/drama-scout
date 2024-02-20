document.addEventListener("DOMContentLoaded", async function(){
    // data set
    const data = await loadData();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = Number(urlParams.get('id'));

    displayCardContentPage(data[id]);

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
        document.querySelector("#location-list").innerHTML = ``;
        divElement = document.createElement("div");
        divElement.innerHTML = `
            <div id="mapnav-tab" class="row">
                <div id="mapnav-location-tab" class="mapnav-tab-item active-tab col-6">Location</div>
                <div id="mapnav-search-tab" class="mapnav-tab-item col-6">Search</div>
            </div>
            <div id="mapnav-container">
            </div>
        `
        document.querySelector("#location-list").appendChild(divElement)

        renderLocationNav(map, data[id]);

        document.querySelector("#mapnav-location-tab").addEventListener("click", function(){
            document.querySelector("#mapnav-location-tab").classList.add("active-tab");
            document.querySelector("#mapnav-location-tab").classList.remove("inactive-tab");
            document.querySelector("#mapnav-search-tab").classList.add("inactive-tab");
            document.querySelector("#mapnav-search-tab").classList.remove("active-tab");

            renderLocationNav(map, data[id]);
        })

        document.querySelector("#mapnav-search-tab").addEventListener("click", function(){
            document.querySelector("#mapnav-search-tab").classList.add("active-tab");
            document.querySelector("#mapnav-search-tab").classList.remove("inactive-tab");
            document.querySelector("#mapnav-location-tab").classList.add("inactive-tab");
            document.querySelector("#mapnav-location-tab").classList.remove("active-tab");

            renderSearchNav(map, data[id]);
        })
    })

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

    // plot markers of location on map
    displayDramaMarkers(map, data[id]);
})


// card content page
function displayCardContentPage(data){
    let divElement = document.querySelector("#content-container");
    divElement.innerHTML = ``;

    divElement.innerHTML = `
        <div id="drama-content" class="row">
            <div id="drama-image-container" class="col-12 col-md-4">
                <div id="drama-image"></div>
            </div>
            <div id="drama-details" class="col-12 col-md-8">
                <div id="year">${data.year}</div>
                <div id="drama-name">${data.drama}</div>
                <div id="drama-synopsis">${data.synopsis}</div>
                <div id="genre"><i class="bi bi-tags-fill"></i>${data.genre}</div>
            </div>
        </div>
        <div id="tab">
            <div id="location-list-tab"><i class="bi bi-geo"></i>Location List</div>
            <div id="map-tab"><i class="bi bi-map"></i>Map</div>
        </div>
        <div id="tab-container">
            <div id="location-nav">
                <div id="location-list"></div>
                <div id="nav-icon"><i class="bi bi-caret-left-fill"></i></div>
            </div> 
            <div id="map"></div>
        </div>
    `
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
            childElement.querySelector("a").innerHTML = `<i class="bi bi-exclamation-circle"></i>`
        };

        childElement.querySelector(".location-image").style.backgroundImage = `url(${location.image})`

        divElement.appendChild(childElement);

    }

    return divElement
}

// reset location list
function resetLocationList(data){
    document.querySelector("#location-list").innerHTML = ``;
    let locationLists = renderLocation(data);
    document.querySelector("#location-list").appendChild(locationLists);
}

function renderLocationNav(map, data){
    const divElement = document.querySelector("#mapnav-container");
    divElement.innerHTML = ``;
    
    for (let location of data.location){
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
            childElement.querySelector("a").innerHTML = `<i class="bi bi-exclamation-circle"></i>`
        };

        childElement.querySelector(".mapnav-location-image").style.backgroundImage = `url(${location.image})`

        divElement.appendChild(childElement);
        childElement.querySelector(".mapnav-item-container").addEventListener("click", function(){
            map.flyTo([location.latitude, location.longitude], 16);
            document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-right-fill"></i>`;
            document.querySelector("#location-list").classList.add("close");
        })

    }
    
}

function renderSearchNav(map, data){
    divElement = document.querySelector("#mapnav-container");
    divElement.innerHTML = ``;

    divElement.innerHTML = `
        <div id="search-category-container">
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

        <div id="mapnav-searchbar">
            <div id="mapnav-searchbar-border" class="row">
                <div id="mapnav-search-input" class="col-9">
                    <input id="input-text" type="text" placeholder="Search a place"/>
                </div>
                <div id="mapnav-x-icon" class="col-2">
                    <i class="bi bi-x-lg"></i>
                </div>
                <div id="mapnav-search-icon" class="col-1">
                    <i class="bi bi-search"></i>
                </div>
            </div>
            <div id="mapnav-result-box">
                <ul id="mapnav-result-box-list"> 
                </ul>
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
    });

    document.querySelector("#art-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#art-pic");
        changeIcon(divElement, "art", ["attractions", "food", "shopping"]);
    });

    document.querySelector("#food-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#food-pic");
        changeIcon(divElement, "food", ["attractions", "art", "shopping"]);
    });

    document.querySelector("#shopping-pic").addEventListener("click", function(){
        const divElement = document.querySelector("#shopping-pic");
        changeIcon(divElement, "shopping", ["attractions", "art", "food"]);
    })
    
}

// change icon of nav on click
function changeIcon(divElement, activeClass, inactiveArray){
    divElement.classList.add(`${activeClass}-pic-active`);

    for (let category of inactiveArray){
        document.querySelector(`#${category}-pic`).classList.remove(`${category}-pic-active`);
    }
}

// plot markers of location on map
function displayDramaMarkers(map, data){
    let provinceLayers = {};
    const provinceGroup = L.layerGroup();
    
    for (let element of data.location){
        let locationIcon = L.icon({
            iconUrl: 'image/map/drama-location-icon.png',
            iconSize: [40, 40],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
        });
        let locationMarker = L.marker([element.latitude, element.longitude], {icon: locationIcon});
        locationMarker.bindPopup(`<h4>${element.name}</h4>
                                    <p>${element.address}</p>`);

        if (!provinceLayers[element.province]) {
            provinceLayers[element.province] = L.layerGroup().addTo(map);
        } 
        
        locationMarker.addTo(provinceLayers[element.province]);
        
    }

    L.control.layers(null, provinceLayers).addTo(map);
};

