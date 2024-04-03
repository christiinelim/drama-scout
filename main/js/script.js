async function main(){
    // data set
    const data = await loadData();

    // dramalist array
    const dramaList = await loadDrama(data);

    // render cards
    renderCard(data);

    // navbar small
    document.querySelector("#menu-button-click").addEventListener("click", function(){
        if (document.querySelector("#dropdown").classList.contains("close")){
            onNavBarOpen();
        }
        else{
            onNavBarClose();
        }
    });


    // autocomplete search
    document.querySelector("#input-text").addEventListener("keyup", function(){
        const searchTerm = document.querySelector("#input-text").value;

        if (searchTerm != ""){
            autocompleteFilter(searchTerm, dramaList);
            onDramaAutoCompleteActive();
        } else {
            resetDramaSearchField()
        }
    })

    // search
    document.querySelector("#search-button-actual").addEventListener("click", function(){
        const searchTerm = document.querySelector("#input-text").value;
        let resultArray = [];

        if (searchTerm == ""){
            onSearchError();
        } else {
            for (let element of data){
                if (element.drama.toLowerCase().includes(searchTerm.toLowerCase())){
                   resultArray.push(element);
               }
           }
        }

        if (resultArray.length == 0 && searchTerm != ""){
            onNoMatch();
            resetDramaSearchField();
        } else if (searchTerm == "") {
            
        } else {
            renderCard(resultArray);
            resetDramaSearchField();
        }
    })

    // clear search icon
    document.querySelector("#x-icon").addEventListener("click", function(){
        if (document.querySelector("#input-text").value != ""){
            document.querySelector("#input-text").value = "";
            renderCard(data);
            resetDramaSearchField();
        }
    })
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
                autocompleteSuggestion = true;
                resetDramaSearchField();
            })
        }
    }

    if (searchList.innerHTML == `` && searchTerm != ""){
        const liElement = document.createElement("li");
        liElement.innerHTML = `Sorry no match found`;
        searchList.appendChild(liElement);
    }
}

function renderCard(data){
    const divElement = document.querySelector("#drama-cards");
    divElement.innerHTML = ``;
    
    for (let element of data){
        let cardElement = document.createElement("div");
        cardElement.classList.add('my-card-container', 'col-6', 'col-sm-4', 'col-lg-3');
        
        let cardContent = document.createElement("div");
        cardContent.classList.add('my-card');
        cardContent.style.backgroundImage = `url(${element.dramaImage})`;
    
        cardContent.innerHTML = element.drama;

        const anchorElement = document.createElement('a');
        anchorElement.href = `cardContent.html?id=${element.id}`;
        anchorElement.appendChild(cardContent);
        cardElement.appendChild(anchorElement);
        divElement.appendChild(cardElement);

        cardContent.addEventListener("click", function(){

        })
    }
}



main();