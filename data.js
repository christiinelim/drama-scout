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


const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = 'fsq3qbdKT0pS0uYQ6cGARCBFMJ0TnnmHdk9HjRdzizuWVRs=';


// search result
async function search(searchTerm, latLng, category){

    const response = await axios.get(`${BASE_API_URL}/places/search`, {
        params: {
            query: encodeURI(searchTerm),
            ll: latLng,
            sort: 'DISTANCE',
            categories: category,
            radius: 5000,
            limit: 30
        },
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    })

    return response.data;
}

// autocomplete
async function searchTermAutocomplete(searchTerm, latLng, sessionToken){
    const response = await axios.get(`${BASE_API_URL}/autocomplete`, {
        params: {
            query: encodeURI(searchTerm),
            ll: latLng,
            radius: 5000,
            session_token: sessionToken,
            limit: 10
        },
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    });

    return response.data
}


// photo of search result
async function getPhoto(fsqID){
    const response = await axios.get(`${BASE_API_URL}/places/${fsqID}/photos`, {
        params: {
            limit: 1
        },
        headers: {
            accept: 'application/json',
            Authorization: API_KEY
        }
    });

    return response.data
}

function loadProvinceLatLng(){
    const provinceLatLng = {
        "southkorea": "35.9078,127.7669",
        "seoul": "37.5519,126.9918",
        "busan": "35.2100,129.0689",
        "daegu": "35.8294,128.5655",
        "incheon": "37.4563,126.7052",
        "gwangju": "35.1557,126.8354",
        "daejeon": "36.3398,127.3940",
        "ulsan": "35.5537,129.2381",
        "gyeonggido": "37.5289,127.1728",
        "gangwondo": "37.7250,128.3010",
        "chungcheongbukdo": "36.7378,127.8305",
        "chungcheongnamdo": "36.5296,126.8591",
        "jeollabukdo": "35.7197,127.1244",
        "jeollanamdo": "34.9402,126.9565",
        "gyeongsangbukdo": "36.3436,28.7402",
        "gyeongsangnamdo": "35.3696,128.2570",
        "jejudo": "33.3846,126.5535",
    }

    return provinceLatLng
}

function loadSearchCategoryID(){
    const searchCategoryID = {
        "Attractions": "16000",
        "Art": "10000",
        "Food": "13000",
        "Shopping": "17000",
    }

    return searchCategoryID
}