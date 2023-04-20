// Define the variables needed for the OpenWeather and for the geocoding API requests as well as the API key 

var cityName = "";
var cities = [];

// Define variables to traverse the DOM

var searchUl = document.getElementById("custom-ul");
var WeatherDiv = document.getElementById("weather-div");

// List functions to execute: 

init ();                    // Call function that loads previous searches  

//displayCurrentSearch();     // Call function that displays current city search on click or enter

// init () - Code for function that will load previous searches

function init () {

   //WeatherDiv.style.display = "none"  // hide div contents

    var previousSearches = JSON.parse(localStorage.getItem("cities"))

    if (previousSearches !== null) {

        cities = previousSearches;
        console.log("Contents of Previous Searches variable: " + previousSearches);
        console.log("Contents of cities variable: " + cities);
    }

    previousSearches.sort();

    renderPrevSearches(); // Call function to create content related to previous searches stored in local storage
}

// renderPrevSearches() - Code for function that will create li elements showing previous searches in the html file

function renderPrevSearches() {

    searchUl.innerHTML = "";

    if (cities == null) {

    return;

    } else {

    var newCities = [...new Set(cities)]; // Create a variable to store cities without duplicates by using the spread operator and set
    for (var i = 0; i < newCities.length; i++) {

        var cityLi = newCities[i];
        var newSearchedCity = document.createElement("li");
        newSearchedCity.className = "custom-li";
        newSearchedCity.textContent = cityLi;
        console.log(newSearchedCity);
        searchUl.appendChild(newSearchedCity);
    }

    // Attach event listener to ".custom-li" elements after they have been created

    var storedCities = document.querySelectorAll(".custom-li");

    storedCities.forEach(function(storedCity) {

        storedCity.addEventListener("click", function(event) {

        event.preventDefault();
        city = this.textContent;  // this is the value that will be used for the api call, so it MUST be called "city" 
        
        console.log(city);
        getCoordinates(city);        // Call the function to get the weather data

        });
    });
    }
}

// getCoordinates(city) - Code for function that will fetch latitude and logitude values from the input or stored city

function getCoordinates(city) {

    var apiKey = "4a31ba71a2f681e1cefe6e395d3fc948"; 
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; // url for GeoCoding API Call

    // Fetch data from OpenWeatherMap Geocoding API

    fetch(apiUrl)

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            console.log(data); // Display the retrieved geocoding data in the console

            if (data.length > 0) {

                var lat = data[0].lat;
                var lon = data[0].lon;

                getCurrentWeather(lat, lon); // Call function to get current weather data based on retrieved latitude and longitude values
                
                getForecastWeather(lat, lon); // Call function to get forecast weather data based on retrieved latitude and longitude values
            
            } else {

                console.log("No geocoding data found for the city: " + city);
            }
        });
}

// getCurrentWeather(lat, lon) - Function to get current weather data based on latitude and longitude

function getCurrentWeather(lat, lon) {

    var apiKey = "4a31ba71a2f681e1cefe6e395d3fc948"; 
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // url for 5-day forecast weather API Call, adding metric units as default

    // Fetch data from OpenWeatherMap (current weather) API

    fetch(apiUrl)

        .then(function(response) {
            
                return response.json();
        })

        .then(function(data) {

            console.log(data); // Display the retrieved weather data in the console

            var currentCity = data.name; 
            var dateObject = new Date(data.dt * 1000) // Date is in Unix timestamp, we need to convert it to milliseconds
            var currentDate = dateObject.toLocaleDateString(); // Convert to date based on user locale.
            var weatherIcon = data.weather[0].icon;
            var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png` // Get the icon image directly from OpenWeather by inserting the icon value in the url that stores images
            var currentTemp = data.main.temp;
            var currentHumidity = data.main.humidity;
            var currentWind = data.wind.speed;

            console.log("City Name: " + currentCity);
            console.log("Current Date: " + currentDate);
            console.log("The icon URL is: " + iconUrl);
            console.log("The current temperature is: " +currentTemp);
            console.log("The current humidity is: " + currentHumidity + "%");
            console.log("The current wind is: " + currentWind + "m/s");
        });
}

// getForecastWeather(lat, lon) - Function to get 5-day forecast weather data based on latitude and longitude

function getForecastWeather(lat, lon) {

    var apiKey = "4a31ba71a2f681e1cefe6e395d3fc948"; 
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // url for current weather API Call, adding metric units as default

    // Fetch data from OpenWeatherMap (current weather) API

    fetch(apiUrl)

        .then(function(response) {
            
                return response.json();
        })

        .then(function(data) {

            console.log(data); // Display the retrieved weather data in the console

            // Loop through each forecast day

            for (var i = 0; i<data.list.length; i++) {  // Forecast is inside  list

                var forecastDay = data.list[i]; // Get data for each day
                var dateObject = new Date(forecastDay.dt * 1000) // Date is in Unix timestamp, we need to convert it to milliseconds
                var forecastDate = dateObject.toLocaleDateString(); // Convert to date based on user locale.
                var weatherIcon = forecastDay.weather[0].icon;
                var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png` // Get the icon image directly from OpenWeather by inserting the icon value in the url that stores images
                var forecastTemp = forecastDay.main.temp;
                var forecastHumidity = forecastDay.main.humidity;
                var forecastWind = forecastDay.wind.speed;

                var dayTile = "day-" + (i + 1); // Set variable for each iteration to be used in each tile with matching id
                document.getElementById(dayTile).innerHTML = `
                <p class="">${forecastDate}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p class="">Temperature: ${forecastTemp} &#8451;</p> 
                <p class="">Humidity: ${forecastHumidity}%</p>
                <p class="">Wind: ${forecastWind} m/s</p>
            `;


                
            }
            console.log("Forecast Day: " + forecastDay);
                console.log("Forecast Date: " + forecastDate);
                console.log("The icon URL is: " + iconUrl);
                console.log("The forecast temperature is: " + forecastTemp);
                console.log("The forecast humidity is: " + forecastHumidity + "%");
                console.log("The forecast wind is: " + forecastWind + "m/s");
        });

}











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


        }
    }  
});


document.getElementById("citySearch").addEventListener ("click", function(event) {
    event.preventDefault();
    cityName = document.getElementById("cityInput").value;
    console.log("City name is: " +cityName);

});

// // Create function to add new city into the storedCities array and update local storage
// function addCityToLocalStorage(city) {
//     // Define variables for local storage
//     var maxCities = 10;
//     var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
//     console.log("storedCities value is : " + storedCities);

//     // Check if city already exists in the array
//     if (!storedCities.includes(city)) {
//         // Add city to the beginning of the array
//         storedCities.unshift(city);
//         // Sort the array alphabetically
//         storedCities.sort();
//         // Limit the array to the maximum number of cities
//         if (storedCities.length > maxCities) {
//         storedCities.pop();
//     }
//     // Update localStorage with the updated array
//     var addCities= localStorage.setItem("cities", JSON.stringify(storedCities));
//     console.log("Local Storage is : " + addCities);
//     }
// }

// // Create function to get data from local storage and append it in the html page

// function appendCitytoPreviousSearches() {
//     var retrieveCities = localStorage.getItem("cities");
//     retrieveCities = JSON.parse(retrieveCities);

//     if (retrieveCities !== null) {
//         for (var i=0; i<retrieveCities.length; i++) {
//             var newSearchedCity = document.createElement("li");
//             newSearchedCity.className = "custom-li";
//             newSearchedCity.textContent = retrieveCities;
//             console.log(newSearchedCity)
//             searchUl.appendChild(newSearchedCity);
//         } 
//     }
// }


            









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

