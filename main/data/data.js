// API FOR FOURSQUARE
const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = 'fsq3qbdKT0pS0uYQ6cGARCBFMJ0TnnmHdk9HjRdzizuWVRs=';

// API FOR OPENWEATHER
const WEATHER_BASE_API_URL = "https://api.openweathermap.org/data/2.5/weather?";
const WEATHER_API_KEY = 'c679cfa59cc8581fbfa19f29b87913c7';


// API FOR OSRM
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/";

async function loadData(){
    const response = await axios.get("data/data.json");
    return response.data
}

function loadDrama(data){
    const dramaList = [];

    for (let element of data){
        dramaList.push(element.drama)
    }

    return dramaList
}

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


// get weather data
async function getWeather(lat, lng){
    const response = await axios.get(`${WEATHER_BASE_API_URL}lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`);

    return response.data
}

// get weather photo
function getWeatherPhoto(data){
    const icon = data.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
    return iconURL;
}


// convert direction name input to lat and lng
async function convertPlaceToLatLong(placeName) {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json`);
    const data = response.data;
    const lat = data[0].lat;
    const lng = data[0].lon;
  
    return([lng, lat])
}

// load direction base on start and end lat lng
async function loadDirections(start, end, profile){
    const requestUrl = `${OSRM_BASE_URL}/${profile}/${start};${end}?steps=true`;
    const response = await axios.get(requestUrl);
    const data = response.data;

    console.log(data)
    const directions = await loadSteps(data);
    const duration = Math.floor(data.routes[0].duration / 60);
    const distance = (data.routes[0].distance / 1000).toFixed(2);

    const routeInformation = {
        "directions": directions,
        "duration": duration,
        "distance": distance,
        "routeGeometry": data.routes[0].geometry
    }
    return routeInformation
} 


// retrieve step from result
async function loadSteps(data) {
    const directions = [];
    let count = 1;
    for (let step of data.routes[0].legs[0].steps) {
        const maneuver = step.maneuver;

        if (maneuver.type == 'depart' ) {
            const instructions = {
                "step": `${count}. Starting point`,
                "image": `image/map/starting-point.png`,
                "distance": ''
            }
            directions.push(instructions);
            count = count + 1;
            continue;
        } else if (maneuver.type == 'arrive'){
            const instructions = {
                "step": `${count}. Destination reached`,
                "image": `image/map/ending-point.png`,
                "distance": ''
            }
            directions.push(instructions);
            count = count + 1;
            continue;
        }
        let turnDirection;
        const bearingBefore = maneuver.bearing_before;
        const bearingAfter = maneuver.bearing_after;

        const bearingDifference = (bearingAfter - bearingBefore + 360) % 360;

        if (bearingDifference < 180) {
            turnDirection = 'right';
        } else {
            turnDirection = 'left';
        }

        const distance = Math.floor(step.distance);

        if (step.name) {
            const instructions = {
              "step": `${count}. Turn ${turnDirection} at ${step.name}`,
              "image": `image/turn-direction/${turnDirection}.png`,
              "distance": `${distance}m`
            }
            directions.push(instructions);
        } else {
            const lat = step.intersections[0].location[1];
            const lng = step.intersections[0].location[0];
            const streetName = await loadStreetName(lat, lng);

            const instructions = {
              "step": `${count}. Turn ${turnDirection} at ${streetName}`,
              "image": `image/turn-direction/${turnDirection}.png`,
              "distance": `${distance}m`
            }
            directions.push(instructions);
        }
        count = count + 1;
    }

    return directions
}



// retrieve streetname if name is empty in data
async function loadStreetName(lat, lng){
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const response = await axios.get(apiUrl);
    const data = response.data;
    const streetName = data.address.road;
    return streetName
}