
const apiKey = "41d84fab69230c719be0fa28de2461ec";

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log(data);

    // Update DOM
    document.querySelector(".city").innerText = data.name;
    document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerText = data.main.humidity + "%";
    document.querySelector(".wind").innerText = data.wind.speed + " km/h";

    // 🌅 Sunrise & Sunset times (in ms)
    const sunrise = data.sys.sunrise * 1000;
    const sunset = data.sys.sunset * 1000;

    // 🕒 Current city time using timezone offset
    const nowUTC = Date.now() + new Date().getTimezoneOffset() * 60000;
    const now = nowUTC + (data.timezone * 1000);

    const isNight = (now < sunrise || now > sunset);

    // Weather condition
    const condition = data.weather[0].main;
    const icon = document.querySelector(".icon");
    let newIcon = "clouds.png"; // default

    // 🌙 Day/Night Weather Icons
    if (condition === "Clouds") {
      newIcon = isNight ? "mooncloud.png" : "clouds.png";
    }
    else if (condition === "Rain") {
      newIcon = isNight ? "raining_moon.png" : "rain.png";
    }
    else if (condition === "Clear") {
      newIcon = isNight ? "half-moon.png" : "clear.png";
    }
    else if (condition === "Mist" || condition === "Haze" || condition === "Fog") {
      newIcon = "mist.png";
    }
    else if (condition === "Snow") {
      newIcon = "snow.png";
    }

    // Set final icon
    icon.src = newIcon;

    // Debug log
    console.log(`Condition: ${condition} | Night: ${isNight} | Icon: ${newIcon}`);
    console.log("Sunrise:", new Date(sunrise).toLocaleTimeString());
    console.log("Sunset:", new Date(sunset).toLocaleTimeString());
    console.log("City Now:", new Date(now).toLocaleTimeString(), isNight ? "🌙 Night" : "☀️ Day");

  } catch (error) {
    alert("Could not fetch weather. Please check the city name.");
    console.error(error);
  }
}

// Initial fetch
fetchWeather("New Delhi");

// Button click
document.querySelector("button").addEventListener("click", function () {
  const city = document.querySelector("input").value;
  fetchWeather(city);
});

// Enter key
document.querySelector("input").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const city = document.querySelector("input").value;
    fetchWeather(city);
  }
});
