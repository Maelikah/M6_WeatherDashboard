
//var apiKey = "4a31ba71a2f681e1cefe6e395d3fc948";

// Define the variables needed for the OpenWeather and for the geocoding API requests as well as the API key 

var apiKey = '4a31ba71a2f681e1cefe6e395d3fc948';
var cityName = '';
// Define variables to traverse the DOM
var searchUl = document.getElementById("custom-ul");




// Add event listener for the search input when the user presses the Enter key
document.getElementById("cityInput").addEventListener ("keypress", function(event) {
    // Check for "Enter" key press
    if (event.key === "Enter") {
        if (this.value.trim() === "") {
            var warningModal = document.getElementById("warningModal");
            warningModal.className = "modal is-active";
            warningModal.querySelector(".modal-background").addEventListener("click", function() {
            warningModal.className = "modal";
            });
            warningModal.querySelector(".modal-close").addEventListener("click", function () {
                warningModal.className = "modal";
                event.stopPropagation();
            });

        } else {
            event.preventDefault();
            cityName = document.getElementById("cityInput").value.toUpperCase();
            console.log("City name is: " +cityName);

            // Call the function to add city to local storage
            addCityToLocalStorage(cityName);

            // Call function to get cities from local storage and append it into previous searches list
           // appendCitytoPreviousSearches();

        }
    }  
});


document.getElementById("citySearch").addEventListener ("click", function(event) {
    event.preventDefault();
    cityName = document.getElementById("cityInput").value;
    console.log("City name is: " +cityName);

});

// Create function to add new city into the storedCities array and update local storage
function addCityToLocalStorage(city) {
    // Define variables for local storage
    var maxCities = 10;
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    console.log("storedCities value is : " + storedCities);

    // Check if city already exists in the array
    if (!storedCities.includes(city)) {
        // Add city to the beginning of the array
        storedCities.unshift(city);
        // Sort the array alphabetically
        storedCities.sort();
        // Limit the array to the maximum number of cities
        if (storedCities.length > maxCities) {
        storedCities.pop();
    }
    // Update localStorage with the updated array
    var addCities= localStorage.setItem("cities", JSON.stringify(storedCities));
    console.log("Local Storage is : " + addCities);
    }
}

// Create function to get data from local storage and append it in the html page

function appendCitytoPreviousSearches() {
    var retrieveCities = localStorage.getItem("cities");
    retrieveCities = JSON.parse(retrieveCities);

    if (retrieveCities !== null) {
        for (var i=0; i<retrieveCities.length; i++) {
            var newSearchedCity = document.createElement("li");
            newSearchedCity.className = "custom-li";
            newSearchedCity.textContent = retrieveCities;
            console.log(newSearchedCity)
            searchUl.appendChild(newSearchedCity);
        } 
    }
}


            









// // Define the OpenWeatherMap Geocoding API endpoint
// const geocodingEndpoint = 'https://api.openweathermap.org/geo/1.0/direct';

// // Build the URL for the geocoding API request
// const geocodingUrl = geocodingEndpoint + "?q=" + encodeURIComponent(cityName) + '&appid=' + apiKey;

// // Fetch geocoding data from OpenWeatherMap API
// fetch(geocodingUrl)
//     .then(response => {
//         if (!response.ok) {
//         throw new Error('Failed to fetch geocoding data');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Process the geocoding data as needed
//         console.log('Geocoding data:', data);
//     })
//     .catch(error => {
//         console.error(error);
//     });

