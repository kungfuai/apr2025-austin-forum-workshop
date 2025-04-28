const { createApp } = Vue;

createApp({
    data() {
        return {
            activeItem: 'current',
            menuItems: [
                { id: 'current', name: 'Current Weather', icon: 'fas fa-sun' },
                { id: 'forecast', name: '5-Day Forecast', icon: 'fas fa-calendar' },
                { id: 'hourly', name: 'Hourly', icon: 'fas fa-clock' },
                { id: 'radar', name: 'Radar', icon: 'fas fa-radar' },
                { id: 'alerts', name: 'Alerts', icon: 'fas fa-bell' },
                { id: 'settings', name: 'Settings', icon: 'fas fa-cog' }
            ],
            currentWeather: {
                temperature: '--',
                feelsLike: '--',
                condition: '--',
                humidity: '--',
                wind: '--',
                uvIndex: '--',
                sunrise: '--',
                sunset: '--'
            },
            stats: [
                { id: 1, value: '--', label: 'Current Temp', icon: 'fas fa-temperature-high', color: '#f59e0b' },
                { id: 2, value: '--', label: 'Humidity', icon: 'fas fa-tint', color: '#3b82f6' },
                { id: 3, value: '--', label: 'Wind Speed', icon: 'fas fa-wind', color: '#10b981' },
                { id: 4, value: '--', label: 'UV Index', icon: 'fas fa-sun', color: '#ef4444' }
            ],
            hourlyForecast: [],
            dailyForecast: [],
            weatherAlerts: [],
            lastUpdated: '--',
            loading: true,
            error: null,
            temperatureChart: null,
            weatherData: null
        }
    },
    methods: {
        setActive(itemId) {
            this.activeItem = itemId;
        },
        formatTime(time) {
            return new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString([], { weekday: 'short' });
        },
        formatDateTime(dateTime) {
            return new Date(dateTime).toLocaleString([], { 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric',
                hour12: true 
            });
        },
        celsiusToFahrenheit(celsius) {
            return Math.round((celsius * 9/5) + 32);
        },
        getWeatherIcon(code) {
            const icons = {
                0: 'fas fa-sun', // Clear sky
                1: 'fas fa-cloud-sun', // Mainly clear
                2: 'fas fa-cloud', // Partly cloudy
                3: 'fas fa-cloud', // Overcast
                45: 'fas fa-smog', // Fog
                48: 'fas fa-smog', // Depositing rime fog
                51: 'fas fa-cloud-rain', // Light drizzle
                53: 'fas fa-cloud-rain', // Moderate drizzle
                55: 'fas fa-cloud-rain', // Dense drizzle
                61: 'fas fa-cloud-rain', // Slight rain
                63: 'fas fa-cloud-rain', // Moderate rain
                65: 'fas fa-cloud-showers-heavy', // Heavy rain
                71: 'fas fa-snowflake', // Slight snow
                73: 'fas fa-snowflake', // Moderate snow
                75: 'fas fa-snowflake', // Heavy snow
                80: 'fas fa-cloud-rain', // Slight rain showers
                81: 'fas fa-cloud-showers-heavy', // Moderate rain showers
                82: 'fas fa-cloud-showers-heavy', // Violent rain showers
                95: 'fas fa-bolt', // Thunderstorm
                96: 'fas fa-bolt', // Thunderstorm with slight hail
                99: 'fas fa-bolt' // Thunderstorm with heavy hail
            };
            return icons[code] || 'fas fa-cloud';
        },
        getWeatherCondition(code) {
            const conditions = {
                0: 'Clear sky',
                1: 'Mainly clear',
                2: 'Partly cloudy',
                3: 'Overcast',
                45: 'Fog',
                48: 'Rime fog',
                51: 'Light drizzle',
                53: 'Moderate drizzle',
                55: 'Dense drizzle',
                61: 'Light rain',
                63: 'Moderate rain',
                65: 'Heavy rain',
                71: 'Light snow',
                73: 'Moderate snow',
                75: 'Heavy snow',
                80: 'Light rain showers',
                81: 'Moderate rain showers',
                82: 'Heavy rain showers',
                95: 'Thunderstorm',
                96: 'Thunderstorm with hail',
                99: 'Thunderstorm with heavy hail'
            };
            return conditions[code] || 'Unknown';
        },
        updateTemperatureChart() {
            if (!this.weatherData) return;

            const canvas = document.getElementById('temperatureChart');
            if (!canvas) {
                console.error('Canvas element not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Could not get canvas context');
                return;
            }
            
            // Destroy existing chart if it exists
            if (this.temperatureChart) {
                this.temperatureChart.destroy();
            }

            // Prepare data for 7 days (168 hours)
            const labels = this.weatherData.hourly.time.slice(0, 168).map(time => this.formatDateTime(time));
            const temperatures = this.weatherData.hourly.temperature_2m.slice(0, 168).map(temp => this.celsiusToFahrenheit(temp));

            this.temperatureChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature (°F)',
                        data: temperatures,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y}°F`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Temperature (°F)'
                            }
                        }
                    }
                }
            });
        },
        async fetchWeatherData() {
            try {
                this.loading = true;
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=America%2FChicago');
                this.weatherData = await response.json();

                // Update current weather
                const currentHour = new Date().getHours();
                const currentTemp = this.celsiusToFahrenheit(this.weatherData.hourly.temperature_2m[currentHour]);
                this.currentWeather = {
                    temperature: `${currentTemp}°F`,
                    feelsLike: `${currentTemp}°F`,
                    condition: this.getWeatherCondition(this.weatherData.hourly.weather_code[currentHour]),
                    humidity: `${this.weatherData.hourly.relative_humidity_2m[currentHour]}%`,
                    wind: `${Math.round(this.weatherData.hourly.wind_speed_10m[currentHour])} mph`,
                    uvIndex: '--', // Not available in free API
                    sunrise: this.formatTime(this.weatherData.daily.sunrise[0]),
                    sunset: this.formatTime(this.weatherData.daily.sunset[0])
                };

                // Update stats
                this.stats = [
                    { id: 1, value: this.currentWeather.temperature, label: 'Current Temp', icon: 'fas fa-temperature-high', color: '#f59e0b' },
                    { id: 2, value: this.currentWeather.humidity, label: 'Humidity', icon: 'fas fa-tint', color: '#3b82f6' },
                    { id: 3, value: this.currentWeather.wind, label: 'Wind Speed', icon: 'fas fa-wind', color: '#10b981' },
                    { id: 4, value: '--', label: 'UV Index', icon: 'fas fa-sun', color: '#ef4444' }
                ];

                // Update hourly forecast
                this.hourlyForecast = this.weatherData.hourly.time.slice(0, 24).map((time, index) => ({
                    id: index,
                    time: this.formatTime(time),
                    temp: `${this.celsiusToFahrenheit(this.weatherData.hourly.temperature_2m[index])}°F`,
                    icon: this.getWeatherIcon(this.weatherData.hourly.weather_code[index])
                }));

                // Update daily forecast
                this.dailyForecast = this.weatherData.daily.time.map((time, index) => ({
                    id: index,
                    day: this.formatDate(time),
                    high: `${this.celsiusToFahrenheit(this.weatherData.daily.temperature_2m_max[index])}°F`,
                    low: `${this.celsiusToFahrenheit(this.weatherData.daily.temperature_2m_min[index])}°F`,
                    icon: this.getWeatherIcon(this.weatherData.daily.weather_code[index]),
                    condition: this.getWeatherCondition(this.weatherData.daily.weather_code[index])
                }));

                this.lastUpdated = new Date().toLocaleTimeString();
                this.loading = false;

                // Update chart after data is loaded and DOM is updated
                this.$nextTick(() => {
                    this.updateTemperatureChart();
                });
            } catch (error) {
                this.error = 'Failed to fetch weather data. Please try again later.';
                this.loading = false;
                console.error('Error fetching weather data:', error);
            }
        }
    },
    mounted() {
        this.fetchWeatherData();
        // Refresh data every 30 minutes
        setInterval(this.fetchWeatherData, 30 * 60 * 1000);
    }
}).mount('#app');
