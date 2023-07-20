// define references to HTML elements
let searchCityInput = document.querySelector("#search-city-input");
let searchCityButton = document.querySelector("#search-city-button");
let searchHistory = document.querySelector("#search-history");
let currentWeather = document.querySelector("#current-weather-container");
let fiveDayForecast = document.querySelector("#forecast-container");

// define global variables
let weatherKey = "327ee92c9d8ab9ee1c3b847e7bac81e7"
let forecastURL = "";
let cityLat = "";
let cityLong = "";
let currentCitySearch = "";
let citySearchHistorySet = new Set();
let citySearchHistoryArray = [];

// checks if local storage exists on page load and updates search history
let onload = function () {
    if (localStorage.getItem("WD-citySearchHistory") !== null) {
            citySearchHistoryArray = JSON.parse(localStorage.getItem("WD-citySearchHistory"));
            citySearchHistorySet = new Set(citySearchHistoryArray);
            createCityButtons(citySearchHistoryArray);
    }
}

// clears HTML elements
let clearWeatherEls = function() {
    searchCityInput.value = "";
    searchHistory.innerHTML = "";
    currentWeather.innerHTML = "";
    fiveDayForecast.innerHTML = "";
} 

// adding to a Set to eliminate duplicates before saving to local storage
let addToSearchHistory = function() {
    citySearchHistorySet.add(currentCitySearch);
    citySearchHistoryArray = [...citySearchHistorySet]
    localStorage.setItem("WD-citySearchHistory", JSON.stringify(citySearchHistoryArray));
}

// function to insert a button for each city in search history
let createCityButtons = function(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        let insButton = document.createElement("button");
            insButton.setAttribute("class", "city-button")
            insButton.innerText = buttons[i];
            searchHistory.appendChild(insButton);
    }
}

// get coordinates fro a searched city and pass them onto define weather API URLs function
let getCityCoords = function() {
    let coordRequestURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ currentCitySearch +"&limit=5&appid=" + weatherKey;
    fetch(coordRequestURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            cityLat = data[0].lat;
            cityLong = data[0].lon;
            defineWeatherURLS(cityLat,cityLong);
        });
}
// adds search parameters to API URLs and fires the relevant fetch function
let defineWeatherURLS = function(a,b) {
        weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat="+ a + "&lon=" + b +"&units=metric&appid=" + weatherKey
        forecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+ a + "&lon=" + b +"&units=metric&appid=" + weatherKey
        getCurrentWeather(weatherURL);
        getFiveDayForecast(forecastURL);
}

let getCurrentWeather = function(apiURL) {
    fetch(apiURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            constructCurrentWeather(data);
        });
}

let getFiveDayForecast = function(apiURL) {
    fetch(apiURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            constructFiveDayForecast(data);
        });
}

// dynamically populates the current weather
let constructCurrentWeather = function(data) {
    let cityNameEl = document.createElement("h2");
    cityNameEl.innerText = data.name;
    let dateEl = document.createElement("h3");
    dateEl.innerText = dayjs.unix(data.dt).format("dddd, MMM D, YYYY");
    let imgEl = document.createElement("img");
    let imgURL = "https://openweathermap.org/img/wn/"+ data.weather[0].icon  +"@2x.png";
    imgEl.setAttribute("src", imgURL);
    imgEl.setAttribute("alt", data.weather[0].description);
    let tempEl = document.createElement("h4");
    tempEl.innerText = "Temp: " + Math.round(data.main.temp) + "°C";
    let humidityEl = document.createElement("h4");
    humidityEl.innerText = "Humidity: " + data.main.humidity + "%";
    let windEl = document.createElement("h4");
    windEl.innerText = "Wind: " + Math.round(data.wind.speed * 3.6) + "km/h";

    currentWeather.appendChild(cityNameEl);
    currentWeather.appendChild(dateEl);
    currentWeather.appendChild(imgEl);
    currentWeather.appendChild(tempEl);
    currentWeather.appendChild(humidityEl);
    currentWeather.appendChild(windEl);
}

// dynamically populates the five-day forecast
let constructFiveDayForecast = function(data) {
    for (let i = 1; i <= 5; i ++) {
        let index = ((i*8)-1);
        let dayDiv = document.createElement("div");
        dayDiv.setAttribute("id", "single-day-forecast");
        let dateEl = document.createElement("h3");
        dateEl.innerText = dayjs(data.list[index].dt_txt).format("dddd");
        let imgEl = document.createElement("img");
        let imgURL = "https://openweathermap.org/img/wn/"+ data.list[index].weather[0].icon  +".png";
        imgEl.setAttribute("src", imgURL);
        imgEl.setAttribute("alt", data.list[index].weather[0].description);
        let tempEl = document.createElement("h4");
        tempEl.innerText = "Temp: " + Math.round(data.list[index].main.temp) + "°C";
        let humidityEl = document.createElement("h4")
        humidityEl.innerText = "Humidity: " + data.list[index].main.humidity + "%";
        let windEl = document.createElement("h4");
        windEl.innerText = "Wind: " + Math.round(data.list[index].wind.speed * 3.6) + "km/h";

        dayDiv.appendChild(dateEl);
        dayDiv.appendChild(imgEl);
        dayDiv.appendChild(tempEl);
        dayDiv.appendChild(humidityEl);
        dayDiv.appendChild(windEl);
        fiveDayForecast.appendChild(dayDiv);
    }
}

// event listeners for search button press, fires multiple functions to save, clear and then populate the page
searchCityButton.addEventListener("click", function(event) {
    event.preventDefault()
    currentCitySearch = searchCityInput.value.toUpperCase()
    addToSearchHistory();
    clearWeatherEls();
    createCityButtons(citySearchHistoryArray);
    getCityCoords();
});

// event listeners for search button press, fires multiple functions clear and then populate the page
searchHistory.addEventListener("click", function(event) {
    currentCitySearch = event.target.innerText;
    clearWeatherEls();
    createCityButtons(citySearchHistoryArray);
    getCityCoords();
});

// executes onload  function on application open
onload();