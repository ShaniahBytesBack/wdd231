document.addEventListener("DOMContentLoaded", () => {
  const weatherApiKey = "abb6014e1533f3fadb75442bef34226a";
  async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Salt+Lake+City,US&appid=${weatherApiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather fetch failed");
      const data = await response.json();
      const weatherDiv = document.getElementById("current-weather");
      if (weatherDiv) {
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
          </div>
        `;
      }
    } catch (error) {
      console.error("Weather error:", error);
    }
  }

  async function getForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Salt+Lake+City,US&appid=${weatherApiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Forecast fetch failed");
      const data = await response.json();
      const forecastDiv = document.getElementById("weather-forecast");
      if (forecastDiv) {
        let days = {};
        data.list.forEach((item) => {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString(undefined, { weekday: "long" });
          if (!days[day] && date.getHours() === 12) {
            days[day] = {
              min: item.main.temp_min,
              max: item.main.temp_max,
              icon: item.weather[0].icon,
              desc: item.weather[0].description,
            };
          }
        });
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

  async function displaySpotlights() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) throw new Error("Could not fetch members data");
      const data = await response.json();

      const eligible = data.members.filter(
        (m) => m.membership === "Gold" || m.membership === "Silver"
      );

      eligible.sort(() => 0.5 - Math.random());
      const count = Math.floor(Math.random() * 2) + 2; // 2 or 3
      const spotlights = eligible.slice(0, count);

      const spotDiv = document.getElementById("spotlights");
      spotDiv.innerHTML = "";
      spotlights.forEach((member) => {
        const card = document.createElement("section");
        card.className = "member-card";
        card.innerHTML = `
          <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
          <h3>${member.name}</h3>
          <p><a href="tel:${member.phone.replace(/[^+\d]/g, "")}" class="phone-link">${member.phone}</a></p>
          <p><a href="https://www.google.com/maps/search/?q=${encodeURIComponent(member.address)}" target="_blank" class="address-link">${member.address}</a></p>
          <p><a href="${member.website}" target="_blank">Visit Website</a></p>
          <p>Membership: ${member.membership}</p>
        `;
        spotDiv.appendChild(card);
      });
    } catch (err) {
      document.getElementById("spotlights").innerHTML = "<p>Unable to load spotlights.</p>";
      console.error(err);
    }
  }

  const lastModified = document.getElementById("lastModified");
  if (lastModified) lastModified.textContent = document.lastModified;
  const year = document.getElementById("currentyear");
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.getElementById("menu");
  const nav = menuButton?.closest("nav");
  menuButton?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  getWeather();
  getForecast();
  displaySpotlights();
});


function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.discover-card');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach(card => observer.observe(card));
}

const backToTopBtn = document.createElement('button');
backToTopBtn.textContent = "↑ Top";
backToTopBtn.id = "backToTop";
backToTopBtn.style.position = "fixed";
backToTopBtn.style.bottom = "32px";
backToTopBtn.style.right = "32px";
backToTopBtn.style.display = "none";
backToTopBtn.style.background = "#1e90ff";
backToTopBtn.style.color = "#fff";
backToTopBtn.style.border = "none";
backToTopBtn.style.borderRadius = "50%";
backToTopBtn.style.width = "48px";
backToTopBtn.style.height = "48px";
backToTopBtn.style.fontSize = "1rem";
backToTopBtn.style.boxShadow = "0 2px 8px #1e90ff33";
backToTopBtn.style.cursor = "pointer";
backToTopBtn.style.zIndex = "1000";
backToTopBtn.style.transition = "opacity 0.3s";

backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
    backToTopBtn.style.opacity = "1";
  } else {
    backToTopBtn.style.opacity = "0";
    setTimeout(() => {
      if (window.scrollY < 300) backToTopBtn.style.display = "none";
    }, 300);
  }
});