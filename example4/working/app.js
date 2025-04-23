const { createApp } = Vue;

createApp({
    data() {
        return {
            location: 'Austin',
            currentLocation: 'Austin, TX',
            currentTemp: '--',
            currentDesc: '--',
            windSpeed: '--',
            humidity: '--',
            cloudCover: '--',
            currentTime: new Date().toLocaleTimeString(),
            forecast: [],
            menuItems: [
                { id: 1, text: 'Current Weather', icon: 'mdi mdi-weather-cloudy' },
                { id: 2, text: 'Forecast', icon: 'mdi mdi-calendar' },
                { id: 3, text: 'Settings', icon: 'mdi mdi-cog' }
            ],
            activeItem: 1,
            coordinates: { latitude: 30.2672, longitude: -97.7431 }, // Default to Austin coordinates
            temperatureChart: null
        }
    },
    methods: {
        celsiusToFahrenheit(celsius) {
            return Math.round((celsius * 9/5) + 32);
        },
        async searchLocation() {
            try {
                const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${this.location}`);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    this.coordinates = {
                        latitude: data.results[0].latitude,
                        longitude: data.results[0].longitude
                    };
                    this.currentLocation = `${data.results[0].name}, ${data.results[0].country_code}`;
                    await this.updateWeather();
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        },
        async updateWeather() {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${this.coordinates.latitude}&longitude=${this.coordinates.longitude}&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&timezone=auto`
                );
                const data = await response.json();
                
                // Update current weather
                this.currentTemp = this.celsiusToFahrenheit(data.current.temperature_2m);
                this.humidity = data.current.relative_humidity_2m;
                this.cloudCover = data.current.cloud_cover;
                this.windSpeed = Math.round(data.current.wind_speed_10m);
                this.currentDesc = this.getWeatherDescription(data.current.weather_code);
                
                // Update forecast
                this.forecast = data.daily.time.slice(0, 5).map((date, index) => {
                    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                    return {
                        day,
                        icon: this.getWeatherIcon(data.daily.weather_code[index]),
                        high: this.celsiusToFahrenheit(data.daily.temperature_2m_max[index]),
                        low: this.celsiusToFahrenheit(data.daily.temperature_2m_min[index])
                    };
                });

                // Update temperature chart
                this.updateTemperatureChart(data.hourly);
            } catch (error) {
                console.error('Error fetching weather:', error);
            }
        },
        updateTemperatureChart(hourlyData) {
            const ctx = document.getElementById('temperatureChart');
            
            // Prepare data for the next 7 days
            const labels = hourlyData.time.slice(0, 168).map(time => {
                const date = new Date(time);
                return date.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    hour12: true 
                });
            });
            
            const temperatures = hourlyData.temperature_2m.slice(0, 168).map(temp => this.celsiusToFahrenheit(temp));

            if (this.temperatureChart) {
                this.temperatureChart.destroy();
            }

            this.temperatureChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature (°F)',
                        data: temperatures,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
                            mode: 'index',
                            intersect: false
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
        getWeatherDescription(code) {
            const weatherCodes = {
                0: 'Clear sky',
                1: 'Mainly clear',
                2: 'Partly cloudy',
                3: 'Overcast',
                45: 'Foggy',
                48: 'Depositing rime fog',
                51: 'Light drizzle',
                53: 'Moderate drizzle',
                55: 'Dense drizzle',
                61: 'Slight rain',
                63: 'Moderate rain',
                65: 'Heavy rain',
                71: 'Slight snow',
                73: 'Moderate snow',
                75: 'Heavy snow',
                77: 'Snow grains',
                80: 'Slight rain showers',
                81: 'Moderate rain showers',
                82: 'Violent rain showers',
                85: 'Slight snow showers',
                86: 'Heavy snow showers',
                95: 'Thunderstorm',
                96: 'Thunderstorm with slight hail',
                99: 'Thunderstorm with heavy hail'
            };
            return weatherCodes[code] || 'Unknown';
        },
        getWeatherIcon(code) {
            const weatherIcons = {
                0: 'mdi mdi-weather-sunny',
                1: 'mdi mdi-weather-partly-cloudy',
                2: 'mdi mdi-weather-partly-cloudy',
                3: 'mdi mdi-weather-cloudy',
                45: 'mdi mdi-weather-fog',
                48: 'mdi mdi-weather-fog',
                51: 'mdi mdi-weather-rainy',
                53: 'mdi mdi-weather-rainy',
                55: 'mdi mdi-weather-rainy',
                61: 'mdi mdi-weather-rainy',
                63: 'mdi mdi-weather-rainy',
                65: 'mdi mdi-weather-rainy',
                71: 'mdi mdi-weather-snowy',
                73: 'mdi mdi-weather-snowy',
                75: 'mdi mdi-weather-snowy',
                77: 'mdi mdi-weather-snowy',
                80: 'mdi mdi-weather-rainy',
                81: 'mdi mdi-weather-rainy',
                82: 'mdi mdi-weather-rainy',
                85: 'mdi mdi-weather-snowy',
                86: 'mdi mdi-weather-snowy',
                95: 'mdi mdi-weather-lightning',
                96: 'mdi mdi-weather-lightning-rainy',
                99: 'mdi mdi-weather-lightning-rainy'
            };
            return weatherIcons[code] || 'mdi mdi-weather-cloudy';
        }
    },
    mounted() {
        // Update time every second
        setInterval(() => {
            this.currentTime = new Date().toLocaleTimeString();
        }, 1000);
        
        // Fetch initial weather data
        this.updateWeather();
    }
}).mount('#app'); 