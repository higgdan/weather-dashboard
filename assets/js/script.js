console.log("hellooooo");

let weatherKey = "327ee92c9d8ab9ee1c3b847e7bac81e7"

// api.openweathermap.org/data/2.5/forecast?q=München,DE&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

let cityLat = ""; // -37.8142176
let cityLong = ""; // 144.9631608


let requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=Melbourne&limit=5&appid=" + weatherKey

let getCoords = fetch(requestUrl)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log(data[0].state);
        cityLat = data[0].lat;
        cityLong = data[0].lon;
        console.log(cityLat,cityLong);
        return;
    });

console.log(cityLat);