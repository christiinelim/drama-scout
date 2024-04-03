// Styling for Index

function onNavBarOpen() {
    document.querySelector("#dropdown").style.height = "99vh";
    document.querySelector("#menu-button-click").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
    </svg>`;
    document.querySelector("#dropdown").classList.remove("close");
}

function onNavBarClose() {
    document.querySelector("#dropdown").style.height = "0px";
    document.querySelector("#menu-button-click").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
    </svg>`;
    document.querySelector("#dropdown").classList.add("close");
}

function onDramaAutoCompleteActive() {
    document.querySelector("#result-box").style.height = "auto";
    document.querySelector("#result-box").style.boxShadow = "0px 0px 5px 3px rgba(0,0,0,0.2)";
    document.querySelector("#searchbar-border").style.borderRadius = "10px 10px 0px 0px";
    document.querySelector("#searchbar-border").style.boxShadow = "-1px -1px 5px 3px rgba(0,0,0,0.2)";
    document.querySelector("#search-button").style.borderRadius = "0px 5px 0px 0px";
}

function onSearchError() {
    document.querySelector("#error-text").innerHTML = "Please give an input";
    document.querySelector("#error-alert").classList.add("visible");
    setTimeout(function(){
        document.querySelector("#error-alert").classList.remove("visible");
    }, 1500);
}

function onNoMatch() {
    document.querySelector("#error-text").innerHTML = "Sorry no match found";
    document.querySelector("#error-alert").classList.add("visible");
    setTimeout(function(){
        document.querySelector("#error-alert").classList.remove("visible");
    }, 1500);
    resetDramaSearchField();
}

function resetDramaSearchField(){
    document.querySelector("#result-box").style.height = "0px";
    document.querySelector("#result-box").style.boxShadow = "none";
    document.querySelector("#searchbar-border").style.borderRadius = "999px";
    document.querySelector("#searchbar-border").style.boxShadow = "-1px 1px 5px 3px rgba(0,0,0,0.2)";
    document.querySelector("#search-button").style.borderRadius = "0px 999px 999px 0px";
}







// Styling for card content
function onLocationListTabClick() {
    document.querySelector("#location-list-tab-container").style.display = "block";
    document.querySelector("#map-tab-container").style.display = "none"

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

    // hide the reset map button
    document.querySelector("#reposition-map").style.display = "none";
}

function onMapTabClick() {
    document.querySelector("#map-tab-container").style.display = "block";
}

// show mapnav 
function mapnavList(){
    // hide location list tab container 
    document.querySelector("#location-list-tab-container").style.display = "none";
    document.querySelector("#map-tab-container"). style.display = "block";

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

    // unhide the reset map button
    document.querySelector("#reposition-map").style.display = "flex";
}

function onClosingNavArrow() {
    document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-right-fill"></i>`;
    document.querySelector("#location-list").classList.add("close");
}

function onOpeningNavArrow() {
    document.querySelector("#nav-icon").innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
    document.querySelector("#location-list").classList.remove("close");
}


function onDisplayCardContent(data) {
    document.querySelector("#year").innerHTML = data.year;
    document.querySelector("#drama-name").innerHTML = data.drama;
    document.querySelector("#drama-synopsis").innerHTML = data.synopsis;
    document.querySelector("#genre").innerHTML = `<i class="bi bi-tags-fill"></i>${data.genre.join(', ')}`;
    document.querySelector("#drama-image").style.backgroundImage = `url(${data.dramaImage})`;
}


// nav search event listener
function navSearchEventListener(map, data){
    document.querySelector("#mapnav-search-tab").classList.add("active-tab");
    document.querySelector("#mapnav-search-tab").classList.remove("inactive-tab");
    document.querySelector("#mapnav-location-tab").classList.add("inactive-tab");
    document.querySelector("#mapnav-location-tab").classList.remove("active-tab");

    document.querySelector("#mapnav-location-container").style.display = "none";
    document.querySelector("#mapnav-search-container").style.display = "block";

    document.querySelector("#mapnav-direction-container").style.display = "none";

    renderSearchNav(map, data);
}


// nav location event listener
function navLocationEventListener(){
    document.querySelector("#mapnav-location-tab").classList.add("active-tab");
    document.querySelector("#mapnav-location-tab").classList.remove("inactive-tab");
    document.querySelector("#mapnav-search-tab").classList.add("inactive-tab");
    document.querySelector("#mapnav-search-tab").classList.remove("active-tab");

    document.querySelector("#mapnav-location-container").style.display = "block";
    document.querySelector("#mapnav-search-container").style.display = "none";
}

// search autocomplete
function onSearchAutoComplete() {
    document.querySelector("#mapnav-search-suggestion").style.height = "auto";
    document.querySelector("#mapnav-search-suggestion").style.maxHeight = "200px";
    document.querySelector("#mapnav-search-suggestion").style.border = "1px solid lightgrey";
    document.querySelector("#mapnav-search-suggestion").style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 0px 5px 3px";
    document.querySelector("#mapnav-searchbar-border").style.borderRadius = "10px 10px 0px 0px";
    document.querySelector("#mapnav-searchbar-border").style.boxShadow = "rgba(0, 0, 0, 0.2) -1px -1px 5px 3px";
}


function onDirectionClick() {
    document.querySelector("#mapnav-search-container").style.display = "none";
    document.querySelector("#mapnav-direction-container").style.display = "flex";
}

function onDirectionExit() {
    document.querySelector("#mapnav-search-container").style.display = "block";
    document.querySelector("#mapnav-direction-container").style.display = "none";
}


// reset search field
function resetSearchField(){
    document.querySelector("#mapnav-search-suggestion").style.height = "0px";
    document.querySelector("#mapnav-search-suggestion").style.border = "none";
    document.querySelector("#mapnav-search-suggestion").style.removeProperty("box-shadow");
    document.querySelector("#mapnav-searchbar-border").style.borderRadius = "999px";
    document.querySelector("#mapnav-searchbar-border").style.removeProperty("box-shadow");
}

function togglePopupActiveTab(event){
    // add active class style to clicked popup
    event.target.classList.toggle("popup-tab-active");

    // remove from other tab
    const otherPopupTabId = event.target.id == "popup-information" ? "popup-weather" : "popup-information";
    const otherPopupTab = document.getElementById(otherPopupTabId);
    otherPopupTab.classList.remove("popup-tab-active");
}