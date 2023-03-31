// API Key for the calls to OpenWeather
var APIKey = "7c8cf45d028488694d242f6dad561637";
// Grabbing the elements from the HTML
var citySearchEl = document.querySelector("#city-search");
var submitButtonEl = document.querySelector("#submit-btn");
var todaysWeatherEl = document.querySelector("#todays-weather");
var futureWeatherEl = document.querySelector("#future-weather");
var citiesListEl = document.querySelector("#last-cities-container");
var forecastTitleEl = document.querySelector("#forecast-title");
// Global variables
var lat;
var lon;
// Global array for the search history
var searchHist = JSON.parse(localStorage.getItem("city")) || [];

// this function is to make the city name in to coordinates latitute and longitude
function convCityToCoor(city) {

  //URL to make the call to the geocode api from OpenWeather
    var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;

    // Making call to the api
    fetch(coordinates)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            // Fetching the value from the data
            var tempLat = data[0].lat;
            lat = tempLat.toFixed(2);
            var tempLon = data[0].lon;
            lon = tempLon.toFixed(2);
            // Calling the functions that will get the weather data to display on the site
            getTodaysWeather(city);
            getFutureWeather();
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

      // Calling the function that will display the search history buttons
      displaySearchHistory();

}

// Function to call the OpenWeather api for the current weather and get data, the city parameter is used to the get city name
function getTodaysWeather(city) {

  //URL to make the call to the weather api from OpenWeather
    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    // Making call to the api
    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            // Fetching the value from the data
            var temperature = data.list[0].main.temp;
            var wind = data.list[0].wind.speed;
            var humidity = data.list[0].main.humidity;
            var iconCode = data.list[0].weather[0].icon;
            var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
            // Code to clear all the html from the element
            todaysWeatherEl.innerHTML = '';
            // Calling the function that will get the weather data to display on the site
            displayTodaysWeather(temperature, wind, humidity, icon, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

}

// Function to display the current weather, it uses the below parameters to get it from the previous function
function displayTodaysWeather(temp, wind, hum, icon, city) {

  // Dayjs to get today's date
    var date = dayjs().format('MMM D, YYYY');

    // Code to create the title and image elements
    var dateEl = document.createElement('h2');
    var iconEl = document.createElement('img');
    // Code to set the value for the above elements
    iconEl.src = icon;
    dateEl.textContent = city + ' (' + date + ')';
    // Code to append the elements above to the correct element
    dateEl.appendChild(iconEl);
    todaysWeatherEl.appendChild(dateEl);

    // Code to create the temperature element, set the value and append the new element
    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    todaysWeatherEl.appendChild(tempEl);

    // Code to create the wind element, set the value and append the new element
    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    todaysWeatherEl.appendChild(windEl);

    // Code to create the humidity element, set the value and append the new element
    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    todaysWeatherEl.appendChild(humidityEl);

}

// Function to call the OpenWeather api for the future weather and get data
function getFutureWeather() {

  //URL to make the call to the weather api from OpenWeather
    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    // Code to create the title element, set the value and append the new element
    var titleEl = document.createElement('h4');
    forecastTitleEl.innerHTML='';
    titleEl.textContent = '5-Day Forecast:'
    forecastTitleEl.appendChild(titleEl);

    // Making call to the api
    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            // Code to clear all the html from the element
            futureWeatherEl.innerHTML = '';
            // Fetching the value from the data five times for the next 5 days
            for (var i = 1; i < 6; i++){
                var temperature = data.list[i].main.temp;
                var wind = data.list[i].wind.speed;
                var humidity = data.list[i].main.humidity;
                var iconCode = data.list[i].weather[0].icon;
                var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
                // Calling the function that will get the weather data to display on the site
                displayFutureWeather(temperature, wind, humidity, icon, i);
            }
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

    
}

// Function to display the current weather, it uses the below parameters to get it from the previous function
function displayFutureWeather(temp, wind, hum, icon, i) {

  // Code to get the day depending on the current day
    var date = dayjs().add(i, 'day').format('MMM D, YYYY');

    // Code to create the card element which is where all the information is going to be
    var cardEl = document.createElement('div');
    cardEl.classList = 'card';

    // Code to create the date and icon element, set the value and append the new elements
    var dateEl = document.createElement('h6');
    var iconEl = document.createElement('img');
    iconEl.src = icon;
    dateEl.textContent = date;
    dateEl.appendChild(iconEl);
    cardEl.appendChild(dateEl);

    // Code to create the temperature element, set the value and append the new element
    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    cardEl.appendChild(tempEl);

    // Code to create the wind element, set the value and append the new element
    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    cardEl.appendChild(windEl);

    // Code to create the humidity element, set the value and append the new element
    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    cardEl.appendChild(humidityEl);

    //Appending the card element to the future weather element
    futureWeatherEl.appendChild(cardEl);
    
}

// Function to make the buttons functionable
function getWeather() {
  var city = this.getAttribute("data-city");
  convCityToCoor(city);
}

// Function to display the buttons with the search history 
 function displaySearchHistory() {
    // Code to clear all the html from the element
    citiesListEl.innerHTML = '';

    // Iteration to create the whole array of search history, limited to 5 so that the website won't load too many
    for (var i = 0; i < searchHist.length; i++){
        var buttonEl = document.createElement('button');
        buttonEl.classList = 'btn btn-secondary';
        buttonEl.setAttribute('type', 'button');
        buttonEl.textContent = searchHist[i];
        buttonEl.setAttribute("data-city", searchHist[i]);
        buttonEl.onclick = getWeather;
        citiesListEl.appendChild(buttonEl);
    }
} 


// To display the search hsitory even after reload
displaySearchHistory();

// The event listener to start the whole webpage
submitButtonEl.addEventListener("click", function(e){
  e.preventDefault();
  searchHist = JSON.parse(localStorage.getItem("city")) || [];

  // To get the value from the input the user gives
    var citySearchVal = citySearchEl.value.trim();
    // To add the most recent city search to the beginning of the array
    searchHist.unshift(citySearchVal);

    //To save the array to the local storage
    localStorage.setItem("city", JSON.stringify(searchHist));

    // If user doesn't input anything this alert will apply
    if (!citySearchVal) {
        console.error('You need a search input value!');
        return;
    }

    // Calling function to convert city name to coordinates
    convCityToCoor(citySearchVal);
})

