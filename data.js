async function loadData(){
    const response = await axios.get("data.json");
    return response.data
}


function loadDrama(data){
    const dramaList = [];

    for (let element of data){
        dramaList.push(element.drama)
    }

    return dramaList
}
