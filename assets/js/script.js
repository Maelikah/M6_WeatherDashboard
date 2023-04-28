// Define the variables needed for the OpenWeather and for the geocoding API requests as well as the API key. 

var city = "";
var cities = [];

// Define variables to traverse the DOM
var searchButton = document.getElementById(citySearch);
var searchTextbox = document.getElementById(cityInput);
var searchUl = document.getElementById("custom-ul");
var WeatherDiv = document.getElementById("weather-div");
var WeatherSection = document.getElementById("current-weather");
var day1Div = document.getElementById("day-1");
var day2Div = document.getElementById("day-2");
var day3Div = document.getElementById("day-3");
var day4Div = document.getElementById("day-4");
var day5Div = document.getElementById("day-5");

// List functions to execute: 

init ();                    // Call function that loads previous searches  

// Functions : 

// init () - Code for function that will load previous searches

function init () {

   WeatherDiv.style.display = "none"  // hide div contents

    var previousSearches = JSON.parse(localStorage.getItem("cities"));

    if (previousSearches !== null) {

        cities = previousSearches;
        previousSearches.sort(); // Sort searches alphabetically
    }

    

    renderPrevSearches(); // Call function to create content related to previous searches stored in local storage
}


// localStoreCities() - Code for funtion that will store input data inside the cities array into the local storage

function localStoreCities() {

    localStorage.setItem("cities", JSON.stringify(cities));
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
        searchUl.appendChild(newSearchedCity);
    }

    // Attach event listener to ".custom-li" elements after they have been created

    var storedCities = document.querySelectorAll(".custom-li");

    storedCities.forEach(function(storedCity) {

        storedCity.addEventListener("click", function(event) {

        event.preventDefault();
        city = this.textContent;  // this is the value that will be used for the api call, so it MUST be called "city" 
        
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

            WeatherSection.innerHTML = `
            <!-- Vertical Tile for current weather data -->
                <section id="current-weather" class="custom-weather tile is-child is box ">
                    <div class="card">
                        <div class="card-content ">
                            <div class="columns is-vcentered custom-weather-banner">
                                <div class="column is-narrow custom-weather-icon ">
                                    <div class="is-flex is-justify-content-center is-align-items-center  ">
                                        <figure class="image is-64x64">
                                            <img src="${iconUrl}" alt="Weather Icon">
                                        </figure>
                                    </div>
                                </div>
                                <div class="column">
                                    <p class="is-size-4-mobile is-size-3-tablet is-size-2-desktop title has-text-white has-text-weight-bold">${currentCity}  ${currentDate}</p>
                                    
                                </div>
                            </div>
                            <p class="is-size-5-mobile is-size-4-tablet is-size-3-desktop  ">Temp: ${currentTemp} &#8451;</p>
                            <p class="is-size-5-mobile is-size-4-tablet is-size-3-desktop  ">Humidity: ${currentHumidity}%</p>
                            <p class="is-size-5-mobile is-size-4-tablet is-size-3-desktop  ">Wind Speed: ${currentWind}m/s</p>
                        </div>
                    </div>
                </section>
            `;

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
            for (var i = 0; i < data.list.length; i++) {
                var forecastDay = data.list[i];
                var dateObject = new Date(forecastDay.dt * 1000);
                var forecastDate = dateObject.toLocaleDateString();
                var weatherIcon = forecastDay.weather[0].icon;
                var iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
                var forecastTemp = forecastDay.main.temp;
                var forecastHumidity = forecastDay.main.humidity;
                var forecastWind = forecastDay.wind.speed;
    
                // Update innerHTML of respective tile
                var dayTile;
                switch (i) {
                    case 0:
                        dayTile = day1Div;
                        break;
                    case 8:
                        dayTile = day2Div;
                        break;
                    case 16:
                        dayTile = day3Div;
                        break;
                    case 24:
                        dayTile = day4Div;
                        break;
                    case 32:
                        dayTile = day5Div;
                        break;
                    default:
                        continue; // Skip other indices not needed
                }
    
                // Update innerHTML of respective tile with forecast data
                dayTile.innerHTML = `
                    <p class="has-text-centered has-text-weight-bold">${forecastDate}</p>
                    <div class="is-flex is-justify-content-center is-align-items-center">
                        <img class ="custom-weather-banner" src="${iconUrl}" alt="Weather Icon">
                    </div>
                    <p class="has-text-centered is-size-7-mobile ">Temp: ${forecastTemp} &#8451;</p>
                    <p class="has-text-centered is-size-7-mobile ">Humidity: ${forecastHumidity}%</p>
                    <p class="has-text-centered is-size-7-mobile ">Wind: ${forecastWind}m/s</p>
                `;
            }
        });
        WeatherDiv.style.display = "block"  // hide div contents
    }

// Event Listeners

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
            city = document.getElementById("cityInput").value.toUpperCase(); // this is the value that will be used for the api call, so it MUST be called "city"
            cities.push(city);
            localStoreCities();
            renderPrevSearches();
            getCoordinates(city); 
            
            
        }
    }  
});

// Add event listener for the search button when the user inputs data an clicks on search
document.getElementById("citySearch").addEventListener ("click", function(event) {
    
    city = document.getElementById("cityInput").value.toUpperCase();

    if (city === "") {
        event.preventDefault();
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
       // event.preventDefault();
            city = document.getElementById("cityInput").value.toUpperCase(); // this is the value that will be used for the api call, so it MUST be called "city"
            cities.push(city);
            localStoreCities();
            renderPrevSearches();
            getCoordinates(city);    
        }
});