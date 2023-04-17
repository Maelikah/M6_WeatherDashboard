
//var apiKey = "4a31ba71a2f681e1cefe6e395d3fc948";

// Define the city name, state code, country code, limit, and API key for the geocoding API request
var cityName = 'New York';
var apiKey = '4a31ba71a2f681e1cefe6e395d3fc948';


// Add event listener for the search input when the user presses the Enter key
document.getElementById("cityInput").addEventListener ("keypress", function(event) {
    // Check for "Enter" key press
    if (event.key === "Enter") {
        if (this.value.trim() === "") {
            var warningModal = document.getElementById("warningModal");
            warningModal.className = "modal is-active";
            console.log("You need to input data");
            warningModal.querySelector(".modal-background").addEventListener("click", function() {
                warningModal.className = "modal";
            });
            warningModal.querySelector(".modal-close").addEventListener("click", function () {
                warningModal.className = "modal";
                event.stopPropagation();
            });

        } else {
            console.log("Enter was pressed");
            event.preventDefault();
            cityName = document.getElementById("cityInput").value;
            console.log("City name is: " +cityName);

        }
        
    }
    

});



document.getElementById("citySearch").addEventListener ("click", function(event) {
    event.preventDefault();
    cityName = document.getElementById("cityInput").value;
    console.log("City name is: " +cityName);

});















// Define the OpenWeatherMap Geocoding API endpoint
const geocodingEndpoint = 'https://api.openweathermap.org/geo/1.0/direct';

// Build the URL for the geocoding API request
const geocodingUrl = geocodingEndpoint + "?q=" + encodeURIComponent(cityName) + '&appid=' + apiKey;

// Fetch geocoding data from OpenWeatherMap API
fetch(geocodingUrl)
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to fetch geocoding data');
        }
        return response.json();
    })
    .then(data => {
        // Process the geocoding data as needed
        console.log('Geocoding data:', data);
    })
    .catch(error => {
        console.error(error);
    });

