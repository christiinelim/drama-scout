async function main(){
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

    // map
    const map = L.map("wishlist-map");
    await createMap(map);

    // nav icon
    document.querySelector("#wishlist-nav-icon").addEventListener("click", function(){
        if (document.querySelector("#wishlist-nav-icon").innerHTML == `<i class="bi bi-caret-left-fill"></i>`){
            document.querySelector("#wishlist-nav-icon").innerHTML = `<i class="bi bi-caret-right-fill"></i>`;
            document.querySelector("#wishlist-list").classList.add("close");
        } else{
            document.querySelector("#wishlist-nav-icon").innerHTML = `<i class="bi bi-caret-left-fill"></i>`;
            document.querySelector("#wishlist-list").classList.remove("close");
        }
    });

    // location and search tab
    document.querySelector("#wishlist-location-tab").addEventListener("click", function(){
        wishlistNavEventListener("wishlist-location-tab", "wishlist-search-tab", "none");
    })

    document.querySelector("#wishlist-search-tab").addEventListener("click", function(){
        wishlistNavEventListener("wishlist-search-tab", "wishlist-location-tab", "block");
    })

    
    // icon for category
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
}

// change styling when click on location/search tab
function wishlistNavEventListener(id1, id2, display){
    document.querySelector(`#${id1}`).classList.add("wishlist-active-tab");
    document.querySelector(`#${id1}`).classList.remove("wishlist-inactive-tab");
    document.querySelector(`#${id2}`).classList.add("wishlist-inactive-tab");
    document.querySelector(`#${id2}`).classList.remove("wishlist-active-tab");

    document.querySelector("#wishlistnav-container").style.display = display;
}






main();