const { createApp } = Vue;

createApp({
    data() {
        return {
            currentPage: 'Weather Dashboard',
            isSidebarActive: false,
            currentTime: '',
            isLoading: true,
            error: null,
            menuItems: [
                { id: 1, text: 'Current Weather', icon: 'mdi mdi-weather-sunny', link: '#' },
                { id: 2, text: 'Forecast', icon: 'mdi mdi-calendar', link: '#' },
                { id: 3, text: 'Air Quality', icon: 'mdi mdi-air-filter', link: '#' },
                { id: 4, text: 'Radar', icon: 'mdi mdi-radar', link: '#' },
                { id: 5, text: 'Alerts', icon: 'mdi mdi-alert', link: '#' },
                { id: 6, text: 'Settings', icon: 'mdi mdi-cog', link: '#' }
            ],
            currentWeather: {
                temperature: 0,
                condition: '',
                icon: '',
                humidity: 0,
                wind: 0,
                uvIndex: 0
            },
            stats: [
                { id: 1, value: '0°F', label: 'Current Temp', icon: 'mdi mdi-thermometer', color: 'blue' },
                { id: 2, value: '0%', label: 'Humidity', icon: 'mdi mdi-water', color: 'green' },
                { id: 3, value: '0 mph', label: 'Wind Speed', icon: 'mdi mdi-weather-windy', color: 'purple' },
                { id: 4, value: '0', label: 'UV Index', icon: 'mdi mdi-weather-sunny', color: 'orange' }
            ],
            temperatureChart: null,
            airQuality: {
                value: 0,
                status: '',
                class: '',
                pollutants: [
                    { name: 'PM2.5', value: '0 µg/m³' },
                    { name: 'PM10', value: '0 µg/m³' },
                    { name: 'O3', value: '0 ppb' },
                    { name: 'NO2', value: '0 ppb' }
                ]
            }
        }
    },
    methods: {
        toggleSidebar() {
            this.isSidebarActive = !this.isSidebarActive;
            document.querySelector('.sidebar').classList.toggle('active');
        },
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        },
        getWeatherIcon(weatherCode) {
            const iconMap = {
                0: 'mdi mdi-weather-sunny',
                1: 'mdi mdi-weather-partly-cloudy',
                2: 'mdi mdi-weather-partly-cloudy',
                3: 'mdi mdi-weather-cloudy',
                45: 'mdi mdi-weather-fog',
                48: 'mdi mdi-weather-fog',
                51: 'mdi mdi-weather-partly-rainy',
                53: 'mdi mdi-weather-rainy',
                55: 'mdi mdi-weather-pouring',
                61: 'mdi mdi-weather-rainy',
                63: 'mdi mdi-weather-rainy',
                65: 'mdi mdi-weather-pouring',
                71: 'mdi mdi-weather-snowy',
                73: 'mdi mdi-weather-snowy',
                75: 'mdi mdi-weather-snowy-heavy',
                77: 'mdi mdi-weather-snowy',
                80: 'mdi mdi-weather-partly-rainy',
                81: 'mdi mdi-weather-rainy',
                82: 'mdi mdi-weather-pouring',
                85: 'mdi mdi-weather-snowy',
                86: 'mdi mdi-weather-snowy-heavy',
                95: 'mdi mdi-weather-lightning',
                96: 'mdi mdi-weather-lightning-rainy',
                99: 'mdi mdi-weather-lightning-rainy'
            };
            return iconMap[weatherCode] || 'mdi mdi-weather-cloudy';
        },
        getWeatherCondition(weatherCode) {
            const conditionMap = {
                0: 'Clear sky',
                1: 'Mainly clear',
                2: 'Partly cloudy',
                3: 'Overcast',
                45: 'Foggy',
                48: 'Foggy',
                51: 'Light drizzle',
                53: 'Moderate drizzle',
                55: 'Dense drizzle',
                61: 'Light rain',
                63: 'Moderate rain',
                65: 'Heavy rain',
                71: 'Light snow',
                73: 'Moderate snow',
                75: 'Heavy snow',
                77: 'Snow grains',
                80: 'Light rain showers',
                81: 'Moderate rain showers',
                82: 'Heavy rain showers',
                85: 'Light snow showers',
                86: 'Heavy snow showers',
                95: 'Thunderstorm',
                96: 'Thunderstorm with hail',
                99: 'Thunderstorm with heavy hail'
            };
            return conditionMap[weatherCode] || 'Cloudy';
        },
        formatHour(hourString) {
            const date = new Date(hourString);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                hour12: true 
            });
        },
        createTemperatureChart(hourlyData) {
            if (this.temperatureChart) {
                this.temperatureChart.destroy();
            }

            const ctx = this.$refs.temperatureChart.getContext('2d');
            this.temperatureChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hourlyData.time.map(time => this.formatHour(time)),
                    datasets: [{
                        label: 'Temperature (°F)',
                        data: hourlyData.temperature_2m,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },
        async fetchWeatherData() {
            try {
                const latitude = 30.2672;
                const longitude = -97.7431;
                
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FChicago`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                
                const data = await response.json();
                
                // Update current weather
                this.currentWeather = {
                    temperature: Math.round(data.current.temperature_2m),
                    condition: this.getWeatherCondition(data.current.weather_code),
                    icon: this.getWeatherIcon(data.current.weather_code),
                    humidity: Math.round(data.current.relative_humidity_2m),
                    wind: Math.round(data.current.wind_speed_10m),
                    uvIndex: 0 // Not available in free API
                };
                
                // Update stats
                this.stats = [
                    { id: 1, value: `${Math.round(data.current.temperature_2m)}°F`, label: 'Current Temp', icon: 'mdi mdi-thermometer', color: 'blue' },
                    { id: 2, value: `${Math.round(data.current.relative_humidity_2m)}%`, label: 'Humidity', icon: 'mdi mdi-water', color: 'green' },
                    { id: 3, value: `${Math.round(data.current.wind_speed_10m)} mph`, label: 'Wind Speed', icon: 'mdi mdi-weather-windy', color: 'purple' },
                    { id: 4, value: 'N/A', label: 'UV Index', icon: 'mdi mdi-weather-sunny', color: 'orange' }
                ];
                
                // Create temperature chart
                this.createTemperatureChart(data.hourly);
                
                this.isLoading = false;
            } catch (error) {
                this.error = error.message;
                this.isLoading = false;
            }
        }
    },
    mounted() {
        this.updateTime();
        setInterval(this.updateTime, 1000);
        this.fetchWeatherData();
    }
}).mount('#app');
