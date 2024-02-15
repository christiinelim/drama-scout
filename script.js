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

    const data = await loadData();

    const dramaList = await loadDrama(data);


    // autocomplete search
    document.querySelector("#input-text").addEventListener("keyup", function(){
        const searchTerm = document.querySelector("#input-text").value;

        if (searchTerm != ""){
            autocompleteFilter(searchTerm, dramaList);
            document.querySelector("#result-box").style.height = "auto";
            document.querySelector("#result-box").style.boxShadow = "0px 0px 5px 3px rgba(0,0,0,0.2)";
            document.querySelector("#searchbar-border").style.borderRadius = "10px 10px 0px 0px";
            document.querySelector("#searchbar-border").style.boxShadow = "-1px -1px 5px 3px rgba(0,0,0,0.2)";
            document.querySelector("#search-button").style.borderRadius = "0px 5px 0px 0px";
        } else {
            resetSearchField()
        }
    })

    // generate cards
    generateCard(data)
}



function autocompleteFilter(searchTerm, dramaList){
    const searchList = document.querySelector("#result-box-list");
    searchList.innerHTML = ``;

    for (let drama of dramaList){
        if (searchTerm == ""){
            continue
        }
        else if (drama.toLowerCase().includes(searchTerm.toLowerCase())){
            const liElement = document.createElement("li");
            liElement.innerHTML = drama;
            searchList.appendChild(liElement);
            liElement.addEventListener("click", function(){
                document.querySelector("#input-text").value = drama;
                resetSearchField()
            })
        }
    }

    if (searchList.innerHTML == `` && searchTerm != ""){
        const liElement = document.createElement("li");
        liElement.innerHTML = `Sorry no match found`;
        searchList.appendChild(liElement);
    }
}


function resetSearchField(){
    document.querySelector("#result-box").style.height = "0px";
    document.querySelector("#result-box").style.boxShadow = "none";
    document.querySelector("#searchbar-border").style.borderRadius = "999px";
    document.querySelector("#searchbar-border").style.boxShadow = "-1px 1px 5px 3px rgba(0,0,0,0.2)";
    document.querySelector("#search-button").style.borderRadius = "0px 999px 999px 0px";
}

function generateCard(data){
    const divElement = document.querySelector("#drama-cards");
    
    for (let element of data){
        let cardElement = document.createElement("div");
        cardElement.classList.add('my-card-container', 'col-6', 'col-md-4', 'col-lg-3');
        
        let cardContent = document.createElement("div");
        cardContent.classList.add('my-card');
        cardContent.style.backgroundImage = `url(${element.dramaImage})`;
    
        cardContent.innerHTML = element.drama;
        cardElement.appendChild(cardContent)
        divElement.appendChild(cardElement)
    }
}



main()