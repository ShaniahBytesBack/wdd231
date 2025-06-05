document.addEventListener("DOMContentLoaded", () => {
  const membersContainer = document.getElementById("members");
  const weatherApiKey = "abb6014e1533f3fadb75442bef34226a";

  // Weather fetch function
  async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Salt+Lake+City,US&appid=${weatherApiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather fetch failed");
      const data = await response.json();

      const weatherDiv = document.getElementById("current-weather");
      if (weatherDiv) {
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        weatherDiv.innerHTML = `
          <div class="weather-main">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" />
            <div class="weather-location">${data.name}, ${data.sys.country}</div>
            <div class="weather-date">${new Date().toLocaleDateString()}</div>
            
          </div>
          <div class="weather-details">
            <span class="weather-temp"><b>${Math.round(data.main.temp)}°F</b></span>
            <div>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</div>
            <div>High: ${Math.round(data.main.temp_max)}°</div>
            <div>Low: ${Math.round(data.main.temp_min)}°</div>
            <div>Humidity: ${data.main.humidity}%</div>
            <div>Sunrise: ${sunrise}</div>
            <div>Sunset: ${sunset}</div>
          </div>
        `;
      }
    } catch (error) {
      console.error("Weather error:", error);
    }
  }

  // Fetch and display 3-day forecast
  async function getForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Salt+Lake+City,US&appid=${weatherApiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Forecast fetch failed");
      const data = await response.json();

      // Group forecast by day
      const forecastDiv = document.getElementById("weather-forecast");
      if (forecastDiv) {
        let days = {};
        data.list.forEach((item) => {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString(undefined, { weekday: "long" });
          if (!days[day]) {
            days[day] = {
              min: item.main.temp_min,
              max: item.main.temp_max,
              icon: item.weather[0].icon,
              desc: item.weather[0].description,
            };
          } else {
            days[day].min = Math.min(days[day].min, item.main.temp_min);
            days[day].max = Math.max(days[day].max, item.main.temp_max);
          }
        });

        // Show only the next 3 days
        const dayNames = Object.keys(days).slice(0, 3);
        forecastDiv.innerHTML = dayNames
          .map(
            (day) => `
              <div class="forecast-row">
                <strong>${day}</strong>
                <img src="https://openweathermap.org/img/wn/${days[day].icon}.png" alt="${days[day].desc}" />
                <span class="forecast-temp">${Math.round(days[day].min)}°F / ${Math.round(days[day].max)}°F</span>
                <span class="forecast-desc">${days[day].desc}</span>
              </div>`
          )
          .join("");
      }
    } catch (error) {
      console.error("Forecast error:", error);
    }
  }

  // Load member data from JSON file
  const url = "data/members.json"; // adjust path if necessary

  async function getMembersData() {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      displayMembers(data.members);
    } catch (error) {
      console.error("Failed to fetch member data:", error);
      membersContainer.innerHTML = "<p>Failed to load business directory.</p>";
    }
  }

  function displayMembers(members) {
    membersContainer.innerHTML = "";
    members.forEach((member) => {
      const card = document.createElement("section");
      card.classList.add("member-card");

      const logo = document.createElement("img");
      logo.src = member.image;
      logo.alt = `${member.name} Logo`;
      logo.loading = "lazy";

      const name = document.createElement("h3");
      name.textContent = member.name;

      // Address as a Google Maps link
      const address = document.createElement("p");
      const addressLink = document.createElement("a");
      addressLink.href = `https://www.google.com/maps/search/?q=${encodeURIComponent(
        member.address
      )}`;
      addressLink.target = "_blank";
      addressLink.textContent = member.address;
      addressLink.classList.add("address-link"); // Add this line
      address.appendChild(addressLink);

      // Phone as a tel: link
      const phone = document.createElement("p");
      const phoneLink = document.createElement("a");
      phoneLink.href = `tel:${member.phone.replace(/[^+\d]/g, "")}`;
      phoneLink.textContent = member.phone;
      phoneLink.classList.add("phone-link"); // Add this line
      phone.appendChild(phoneLink);

      const website = document.createElement("a");
      website.href = member.website;
      website.target = "_blank";
      website.textContent = "Visit Website";

      card.appendChild(logo);
      card.appendChild(name);
      card.appendChild(address);
      card.appendChild(phone);
      card.appendChild(website);

      membersContainer.appendChild(card);
    });
  }

  // Set the last modified date
  const lastModified = document.getElementById("lastModified");
  if (lastModified) {
    lastModified.textContent = document.lastModified;
  }

  document.getElementById("currentyear").textContent = new Date().getFullYear();

  // Hamburger menu toggle
  const menuButton = document.getElementById("menu");
  const nav = menuButton?.closest("nav");
  menuButton?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  getWeather(); // <-- Call the weather function
  getForecast();
  getMembersData();
});
