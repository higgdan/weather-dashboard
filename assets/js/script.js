let weatherKey = "327ee92c9d8ab9ee1c3b847e7bac81e7"

let forecastURL = "";
let cityLat = ""; // -37.8142176
let cityLong = ""; // 144.9631608


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