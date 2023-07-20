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