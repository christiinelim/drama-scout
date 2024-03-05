const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/";
const profile = "foot"; // car, bike or foot
var start = '126.977,37.5789'; // Replace with your start point coordinates
var end = '127.0079,37.5663';   // Replace with your end point coordinates

async function convertPlaceToLatLong(placeName) {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json`);
  const data = response.data;
  const lat = data[0].lat;
  const lng = data[0].lon;

  return([lng, lat])

  /*
  // Make a request to Nominatim API
  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json`)
      .then(response => response.json())
      .then(data => {
          // Check if the response contains any results
          if (data && data.length > 0) {
              // Extract lat and lng from the first result
              const lat = data[0].lat;
              const lon = data[0].lon;
              // Call a function to use lat and lng with OSRM
              useLatLongWithOSRM(lat, lon);
          } else {
              console.error("No results found for the given place.");
          }
      })
      .catch(error => {
          console.error("Error fetching data:", error);
      });
  */
}
convertPlaceToLatLong("Namsan Tower")

async function loadDirections(start, end){
    const requestUrl = `${OSRM_BASE_URL}/${profile}/${start};${end}?steps=true`;
    const response = await axios.get(requestUrl);
    const data = response.data;

    await loadSteps(data);


    /*
    // Send the HTTP request
    fetch(requestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Handle the API response
        console.log(data); // Output the response data to the console for demonstration
        // Parse the response and display the route on a map
      })
      .catch(function(error) {
        console.log('Error fetching directions:', error);
      });
      */
} 

async function loadSteps(data) {
    const directions = [];
    for (let step of data.routes[0].legs[0].steps) {
        const maneuver = step.maneuver;

        if (maneuver.type == 'depart' || maneuver.type == 'arrive') {
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

        if (step.name) {
            const instructions = {
              "step": `Turn ${turnDirection} at ${step.name}`,
              "image": `image/turn-direction/${turnDirection}.png`
            }
            directions.push(instructions);
        } else {
            const lat = step.intersections[0].location[1];
            const lng = step.intersections[0].location[0];
            const streetName = await loadStreetName(lat, lng);

            const instructions = {
              "step": `Turn ${turnDirection} at ${streetName}`,
              "image": `image/turn-direction/${turnDirection}.png`
            }
            directions.push(instructions);
        }
    }

    console.log(directions)
}


async function loadStreetName(lat, lng){
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const response = await axios.get(apiUrl);
    const data = response.data;
    const streetName = data.address.road;
    return streetName

    /*
    // Send the HTTP request to the OSM Nominatim API
    fetch(apiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Parse the response and extract the address information
        var address = data.display_name;
        var streetName = data.address.road;

        // Output the reverse geocoded street name
        console.log("Reverse geocoded street name:", streetName);
      })
      .catch(function(error) {
        console.error("Error performing reverse geocoding:", error);
      });
    */
}


// loadDirections(start, end);




/*
function loadSteps(data){
    data.routes[0].legs[0].steps.forEach(async step => {
        const maneuver = step.maneuver;

        if (maneuver.type == 'depart' || maneuver.type == 'arrive') {
            return;
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

        if (step.name) {
            console.log(`Turn ${turnDirection} at ${step.name}`);
        } else {
            const lat = step.intersections[0].location[1];
            const lng = step.intersections[0].location[0];
            const streetName = await loadStreetName(lat, lng);
            console.log(`Turn ${turnDirection} at ${streetName}`);
        }
    });
}
*/


/*
// Assuming 'data' contains the OSRM response

// Loop through each step in the route
data.routes[0].legs[0].steps.forEach(step => {
    // Extract maneuver information from the step
    const maneuver = step.maneuver;

    // Check the type of maneuver
    if (maneuver.type === 'depart' || maneuver.type === 'arrive') {
        // Skip depart and arrive maneuvers
        return;
    }

    // Determine the direction of the turn based on bearing_before and bearing_after
    let turnDirection;
    const bearingBefore = maneuver.bearing_before;
    const bearingAfter = maneuver.bearing_after;

    // Calculate the difference in bearings
    const bearingDifference = (bearingAfter - bearingBefore + 360) % 360;

    // Determine the turn direction based on the bearing difference
    if (bearingDifference < 180) {
        turnDirection = 'right'; // Turn right
    } else {
        turnDirection = 'left'; // Turn left
    }

    // Output the turn direction
    if (step.name) {
        console.log(`Turn ${turnDirection} at ${step.name}`);
    } else {
        console.log(`Turn ${turnDirection}`);
    }
});

  
// Replace these coordinates with the latitude and longitude you want to reverse geocode
var latitude = 37.578655;
var longitude = 126.976567;

// Construct the API request URL
var apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

// Send the HTTP request to the OSM Nominatim API
fetch(apiUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Parse the response and extract the address information
    var address = data.display_name;
    var streetName = data.address.road;

    // Output the reverse geocoded street name
    console.log("Reverse geocoded street name:", streetName);
  })
  .catch(function(error) {
    console.error("Error performing reverse geocoding:", error);
  });


*/















  /*
  // Replace these with your start and end coordinates
var startPoint = '127.0079,37.5663'; // End point coordinates (latitude,longitude)
var endPoint = '126.985,37.5823';    // Start point coordinates (latitude,longitude)

// Construct the API request URL
var apiUrl = 'https://router.project-osrm.org/route/v1/driving/';
var requestUrl = apiUrl + startPoint + ';' + endPoint;

// Send the HTTP request
fetch(requestUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Handle the API response
    console.log("yay")
    console.log(data); // Output the response data to the console for demonstration
    // Parse the response and extract the route information
  })
  .catch(function(error) {
    console.error('Error fetching directions:', error);
  });
  */


  /*
  
  // 1. Identify start and end points using OSM data
var startLngLat = '126.977,37.5789'; // Start point coordinates (longitude,latitude)
var endLngLat = '126.976995,37.578786';   // End point coordinates (longitude,latitude)

// 2. Make request to OSRM API with start and end coordinates
var osrmRequestUrl = `https://router.project-osrm.org/route/v1/driving/${startLngLat};${endLngLat}?steps=true`;

fetch(osrmRequestUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // 3. Parse OSRM response to obtain route information
    console.log(data); // Output the response data to the console for demonstration
    // Extract route geometry and maneuver instructions
    // Display directions to the user
  })
  .catch(function(error) {
    console.error('Error fetching directions:', error);
  });
  */

