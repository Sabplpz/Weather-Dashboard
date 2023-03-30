// API Key for the calls to OpenWeather
var APIKey = "7c8cf45d028488694d242f6dad561637";
// Grabbing the elements from the HTML
var citySearchEl = document.querySelector("#city-search");
var submitButtonEl = document.querySelector("#submit-btn");
var todaysWeatherEl = document.querySelector("#todays-weather");
var futureWeatherEl = document.querySelector("#future-weather");
var citiesListEl = document.querySelector("#last-cities-container");
// Global variables
var lat;
var lon;
var today = "";
// Global array for the search history
var searchHist = [];

function convCityToCoor(event) {
    event.preventDefault();

    var citySearchVal = citySearchEl.value.trim();
    searchHist.unshift(citySearchVal);

    if (!citySearchVal) {
        console.error('You need a search input value!');
        return;
    }

    var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + citySearchVal + '&limit=1&appid=' + APIKey;

    fetch(coordinates)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            var tempLat = data[0].lat;
            lat = tempLat.toFixed(2);
            console.log(lat);
            var tempLon = data[0].lon;
            lon = tempLon.toFixed(2);
            console.log(lon);
            getTodaysWeather();
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

}

function getTodaysWeather() {

    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            var temperature = data.list[0].main.temp;
            console.log(temperature + " °F");
            var wind = data.list[0].wind.speed;
            console.log(wind + " MPH");
            var humidity = data.list[0].main.humidity;
            console.log(humidity + "%");
            var icon = data.list[0].weather[0].icon;
            console.log(icon);
            displayTodaysWeather(temperature, wind, humidity, icon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

}

function displayTodaysWeather(temp, wind, hum, icon) {
    
    var date = dayjs().format('MMM D, YYYY');
    var city = searchHist[0];
    console.log(date);
    console.log(city);

    var dateEl = document.createElement('h2');
    dateEl.textContent = city + ' (' + date + ')  ' +  icon;
    todaysWeatherEl.appendChild(dateEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    todaysWeatherEl.appendChild(tempEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    todaysWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    todaysWeatherEl.appendChild(humidityEl);

}

submitButtonEl.addEventListener("click", convCityToCoor);

