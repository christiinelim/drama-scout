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
        document.querySelector("#location-list-tab").style.borderBottom = "2px solid black";
        document.querySelector("#map-tab").style.borderBottom = ""
    });

    document.querySelector("#map-tab").addEventListener("click", function(){
        document.querySelector("#map-tab").style.borderBottom = "2px solid black";
        document.querySelector("#location-list-tab").style.borderBottom = "none"
    })


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
            <div id="location-list"></div>
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

    for (let location of data.location){
        let childElement = document.createElement("div");


        childElement.innerHTML = `
            <div class="row">
                <div class="location-image-container col-2">
                    <div class="location-image"></div>
                </div>

                <div class="location-exact col-2">
                    <div class="location-name">${location.name}</div>
                    <div class="location-province">${location.province}, ${location.area}</div>
                </div>

                <div class="col-8 row">
                    <div class="location-description col-11">${location.description}</div>

                    <div class="location-website col-1"><a href=${location.website}></a></div>
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
    console.log(divElement);

    return divElement
}