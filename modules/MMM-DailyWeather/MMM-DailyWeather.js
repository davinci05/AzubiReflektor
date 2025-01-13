Module.register("MMM-DailyWeather", {
    defaults: {
        location: "Cologne", // Standardort
        latitude: 50.9375,   // Breitengrad für Köln
        longitude: 6.9603,   // Längengrad für Köln
        units: "metric",    // "metric" für Celsius, "imperial" für Fahrenheit
        days: 3,            // Anzahl der Tage, die angezeigt werden
        widgetWidth: 50,    // Breite als Prozentsatz des Bildschirms
        widgetHeight: 50    // Höhe als Prozentsatz des Bildschirms
    },

    start: function () {
        this.weatherData = null;
        this.getWeather();
        setInterval(() => {
            this.getWeather();
        }, 3600000); // Aktualisierung alle 60 Minuten
    },

    getWeather: function () {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.config.latitude}&longitude=${this.config.longitude}&hourly=temperature_2m,weathercode&timezone=auto`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.weatherData = this.filterDailyWeather(data);
                this.updateDom();
            })
            .catch(error => console.error("Fehler beim Abrufen der Wetterdaten:", error));
    },

    filterDailyWeather: function (data) {
        const dailyWeather = [];
        const hourlyData = data.hourly.time;
        const temperatureData = data.hourly.temperature_2m;
        const weatherCodeData = data.hourly.weathercode;

        for (let i = 0; i < this.config.days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toLocaleDateString("de-DE");

            for (let j = 0; j < hourlyData.length; j++) {
                if (hourlyData[j].includes(date.toISOString().split("T")[0]) && hourlyData[j].includes("15:00")) {
                    let dayLabel = "";
                    if (i === 0) dayLabel = "<strong>Heute</strong>";
                    else if (i === 1) dayLabel = "Morgen";
                    else dayLabel = formattedDate;
                    
                    dailyWeather.push({
                        date: dayLabel,
                        temperature: temperatureData[j],
                        weatherCode: weatherCodeData[j]
                    });
                    break;
                }
            }
        }
        return dailyWeather;
    },

    getWeatherIcon: function (weatherCode, size) {
        const icons = {
            0: "☀️",
            1: "🌤️",
            2: "⛅",
            3: "☁️",
            45: "🌫️",
            48: "🌫️",
            51: "🌦️",
            61: "🌧️",
            80: "🌦️",
            95: "⛈️"
        };
        return `<span style="font-size:${size}vw;">${icons[weatherCode] || "❓"}</span>`;
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        const width = this.config.widgetWidth;
        const height = this.config.widgetHeight;

        wrapper.className = "weather-container";
        wrapper.style.width = `${width}vw`;
        wrapper.style.height = `${height}vh`;
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.justifyContent = "center";
        wrapper.style.alignItems = "center";
        wrapper.style.position = "fixed";
        wrapper.style.top = `${(100 - height) / 2}vh`;  // Zentriert vertikal
        wrapper.style.left = `${(100 - width) / 2}vw`; // Zentriert horizontal
        wrapper.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        wrapper.style.borderRadius = "10px";
        wrapper.style.padding = "2vw";
        wrapper.style.color = "white";
        wrapper.style.fontFamily = "Arial, sans-serif";

        // Überschrift
        const title = document.createElement("h2");
        title.innerHTML = "Feierabend Wetter";
        title.style.fontSize = `${width / 10}vw`;  // Skaliert mit Widget-Breite
        title.style.marginBottom = "2vh";
        wrapper.appendChild(title);

        if (!this.weatherData) {
            const loading = document.createElement("div");
            loading.innerHTML = "Lade Wetterdaten...";
            loading.style.fontSize = `${width / 15}vw`; 
            wrapper.appendChild(loading);
            return wrapper;
        }

        // Wetterdaten Container
        const weatherContainer = document.createElement("div");
        weatherContainer.style.display = "flex";
        weatherContainer.style.justifyContent = "space-around";
        weatherContainer.style.width = "100%";

        this.weatherData.forEach((day, index) => {
            const dayContainer = document.createElement("div");
            dayContainer.style.textAlign = "center";
            dayContainer.style.margin = `0 ${width / 20}vw`;  // Dynamischer Abstand

            const dayLabel = document.createElement("div");
            dayLabel.innerHTML = day.date;
            dayLabel.style.fontSize = `${width / 15}vw`; 
            dayLabel.style.fontWeight = index === 0 ? "bold" : "normal";

            const icon = document.createElement("div");
            icon.innerHTML = this.getWeatherIcon(day.weatherCode, width / 10); // Dynamisches Icon

            const temp = document.createElement("div");
            temp.innerHTML = `<strong>${day.temperature}°C</strong>`;
            temp.style.fontSize = `${width / 12}vw`;

            dayContainer.appendChild(dayLabel);
            dayContainer.appendChild(icon);
            dayContainer.appendChild(temp);
            weatherContainer.appendChild(dayContainer);
        });

        wrapper.appendChild(weatherContainer);

        return wrapper;
    }
});
