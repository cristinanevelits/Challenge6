//adding const list for the variables
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchHistory = document.getElementById("search-history");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");
// function to fetch current weather data
async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e1732718127b1c240066754ea7147d3f`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching current weather data:", error);
        return null;
    }
}
// function to fetch and display current weather
async function fetchAndDisplayCurrentWeather(cityName) {
    const weatherData = await fetchWeatherData(cityName);

    if (weatherData) {
        // extract and format relevant data from weatherData
        const city = weatherData.name;
        const date = new Date(weatherData.dt * 1000);
        const icon = weatherData.weather[0].icon;
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        // update the current weather section
        currentWeather.innerHTML = `
            <h2>${city} (${date.toLocaleDateString()}) <img src="http://openweathermap.org/img/w/${icon}.png" alt="${weatherData.weather[0].description}"></h2>
            <p>Temperature: ${temperature}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} MPH</p>
        `;
    }
}

// ffunction to fetch and display the 5-day forecast
async function fetchAndDisplayForecast(cityName) {
    try {
        const locationResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e1732718127b1c240066754ea7147d3f`);
        const locationData = await locationResponse.json();

        const lat = locationData.coord.lat;
        const lon = locationData.coord.lon;

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e1732718127b1c240066754ea7147d3f`);
        const data = await response.json();

        const forecastData = data.list;

        forecast.innerHTML = "<h2>5-Day Forecast:</h2>";
        for (let i = 0; i < forecastData.length; i += 8) { 
            const forecastItem = forecastData[i];
            const date = new Date(forecastItem.dt * 1000);
            const icon = forecastItem.weather[0].icon;
            const temperature = forecastItem.main.temp;
            const humidity = forecastItem.main.humidity;
            const windSpeed = forecastItem.wind.speed;
            const forecastItemElement = document.createElement("div");
            forecastItemElement.classList.add("forecast-item");
            forecastItemElement.innerHTML = `
                <p>${date.toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/w/${icon}.png" alt="${forecastItem.weather[0].description}">
                <p>Temp: ${temperature}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} MPH</p>
            `;

            forecast.appendChild(forecastItemElement);
        }
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error);
    }
}
// function to update the search history
function updateSearchHistory(cityName) {
    const searchHistoryItem = document.createElement("button");
    searchHistoryItem.textContent = cityName;
    searchHistory.appendChild(searchHistoryItem);
}
// event listener for form submission
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cityName = cityInput.value.trim();

    if (cityName === "") {
        alert("Please enter a city name.");
        return;
    }

    // fetch and display current weather
    await fetchAndDisplayCurrentWeather(cityName);

    // add the city to search history and localStorage
    updateSearchHistory(cityName);
    const searchHistoryItems = Array.from(searchHistory.getElementsByTagName("button"));
    const searchHistoryCities = searchHistoryItems.map((item) => item.textContent);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryCities));

    // fetch and display the 5-day forecast
    fetchAndDisplayForecast(cityName);

    // clear the input field
    cityInput.value = "";
});

// event listener for clicking on a city in the search history
searchHistory.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
        const cityName = e.target.textContent;
        // fetch and display current weather and 5-day forecast for the selected city
        fetchAndDisplayCurrentWeather(cityName);
        fetchAndDisplayForecast(cityName);
    }
});

// retrieve and display the search history from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
        const searchHistoryCities = JSON.parse(storedSearchHistory);
        searchHistoryCities.forEach((city) => {
            updateSearchHistory(city);
        });
    }
});

