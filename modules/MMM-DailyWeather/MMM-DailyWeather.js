Module.register("MMM-DailyWeather", {
    defaults: {
        location: "Cologne", // Standardort
        latitude: 50.9375,   // Breitengrad für Köln
        longitude: 6.9603,   // Längengrad für Köln
        units: "metric",    // "metric" für Celsius, "imperial" für Fahrenheit
        days: 3,              // Anzahl der Tage, die angezeigt werden
        fixedHeight: 140      // Erhöhte feste Höhe für bessere Darstellung und Vermeidung von Überlappungen
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

        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toLocaleDateString("de-DE"); // Format: dd.mm.yyyy

            for (let j = 0; j < hourlyData.length; j++) {
                if (hourlyData[j].includes(date.toISOString().split("T")[0]) && hourlyData[j].includes("15:00")) {
                    let dayLabel = "";
                    if (i === 0) dayLabel = "<strong style='font-size:1.5em; margin-right: 10px;'>Heute</strong>";
                    else if (i === 1) dayLabel = "<span style='margin-right: 10px;'>Morgen</span>";
                    else dayLabel = `<span style='margin-right: 10px;'>${formattedDate}</span>`;
                    
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

    getWeatherIcon: function (weatherCode) {
        const icons = {
            0: "☀️", // Klarer Himmel
            1: "🌤️", // Leicht bewölkt
            2: "⛅", // Teilweise bewölkt
            3: "☁️", // Bewölkt
            45: "🌫️", // Nebel
            48: "🌫️", // Gefrierender Nebel
            51: "🌦️", // Leichter Nieselregen
            61: "🌧️", // Leichter Regen
            80: "🌦️", // Vereinzelte Schauer
            95: "⛈️" // Gewitter
        };
        return icons[weatherCode] || "❓"; // Standard-Icon falls kein Wettercode erkannt wird
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "small";
        wrapper.style.height = this.config.fixedHeight + "px";
        wrapper.style.overflow = "hidden";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "row";
        wrapper.style.justifyContent = "space-around";
        wrapper.style.alignItems = "center";
        wrapper.style.marginBottom = "15px";
        wrapper.style.maxWidth = "100%";
        wrapper.style.position = "fixed";
        wrapper.style.top = "10px";
        wrapper.style.right = "10px";
        wrapper.style.zIndex = "100";

        if (!this.weatherData) {
            wrapper.innerHTML = "Lade Wetterdaten...";
            return wrapper;
        }

        this.weatherData.forEach((day, index) => {
            const dayContainer = document.createElement("div");
            dayContainer.style.textAlign = "center";
            dayContainer.style.margin = "0 20px"; // Mehr Abstand zwischen den Elementen

            const dayLabel = document.createElement("div");
            dayLabel.innerHTML = day.date;
            dayLabel.style.fontWeight = index === 0 ? "bold" : "normal";

            const icon = document.createElement("div");
            icon.innerHTML = this.getWeatherIcon(day.weatherCode);
            icon.style.fontSize = "2.5em";
            
            const temp = document.createElement("div");
            temp.innerHTML = `<strong>${day.temperature}°C</strong>`;
            temp.style.fontSize = index === 0 ? "1.5em" : "1.2em";

            dayContainer.appendChild(dayLabel);
            dayContainer.appendChild(icon);
            dayContainer.appendChild(temp);
            wrapper.appendChild(dayContainer);
        });

        return wrapper;
    }
});
