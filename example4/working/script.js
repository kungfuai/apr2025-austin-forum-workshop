const colorSchemes = [
    {
        primary: '#6366f1',
        primaryHover: '#4f46e5',
        bgDark: '#0f172a',
        bgCard: 'rgba(30, 41, 59, 0.7)',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.1)'
    },
    {
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        bgDark: '#1e1b4b',
        bgCard: 'rgba(30, 27, 75, 0.7)',
        textPrimary: '#f8fafc',
        textSecondary: '#c7d2fe',
        border: 'rgba(199, 210, 254, 0.1)'
    },
    {
        primary: '#ec4899',
        primaryHover: '#db2777',
        bgDark: '#831843',
        bgCard: 'rgba(131, 24, 67, 0.7)',
        textPrimary: '#fdf2f8',
        textSecondary: '#f9a8d4',
        border: 'rgba(249, 168, 212, 0.1)'
    },
    {
        primary: '#10b981',
        primaryHover: '#059669',
        bgDark: '#064e3b',
        bgCard: 'rgba(6, 78, 59, 0.7)',
        textPrimary: '#f0fdf4',
        textSecondary: '#a7f3d0',
        border: 'rgba(167, 243, 208, 0.1)'
    },
    {
        primary: '#f59e0b',
        primaryHover: '#d97706',
        bgDark: '#78350f',
        bgCard: 'rgba(120, 53, 15, 0.7)',
        textPrimary: '#fffbeb',
        textSecondary: '#fcd34d',
        border: 'rgba(252, 211, 77, 0.1)'
    },
    {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        bgDark: '#1e3a8a',
        bgCard: 'rgba(30, 58, 138, 0.7)',
        textPrimary: '#eff6ff',
        textSecondary: '#bfdbfe',
        border: 'rgba(191, 219, 254, 0.1)'
    },
    {
        primary: '#f43f5e',
        primaryHover: '#e11d48',
        bgDark: '#881337',
        bgCard: 'rgba(136, 19, 55, 0.7)',
        textPrimary: '#fff1f2',
        textSecondary: '#fda4af',
        border: 'rgba(253, 164, 175, 0.1)'
    },
    {
        primary: '#06b6d4',
        primaryHover: '#0891b2',
        bgDark: '#164e63',
        bgCard: 'rgba(22, 78, 99, 0.7)',
        textPrimary: '#ecfeff',
        textSecondary: '#a5f3fc',
        border: 'rgba(165, 243, 252, 0.1)'
    },
    {
        primary: '#a855f7',
        primaryHover: '#9333ea',
        bgDark: '#581c87',
        bgCard: 'rgba(88, 28, 135, 0.7)',
        textPrimary: '#faf5ff',
        textSecondary: '#e9d5ff',
        border: 'rgba(233, 213, 255, 0.1)'
    },
    {
        primary: '#14b8a6',
        primaryHover: '#0d9488',
        bgDark: '#134e4a',
        bgCard: 'rgba(19, 78, 74, 0.7)',
        textPrimary: '#f0fdfa',
        textSecondary: '#99f6e4',
        border: 'rgba(153, 246, 228, 0.1)'
    }
];

function applyColorScheme(scheme) {
    document.documentElement.style.setProperty('--primary', scheme.primary);
    document.documentElement.style.setProperty('--primary-hover', scheme.primaryHover);
    document.documentElement.style.setProperty('--bg-dark', scheme.bgDark);
    document.documentElement.style.setProperty('--bg-card', scheme.bgCard);
    document.documentElement.style.setProperty('--text-primary', scheme.textPrimary);
    document.documentElement.style.setProperty('--text-secondary', scheme.textSecondary);
    document.documentElement.style.setProperty('--border', scheme.border);
}

// Apply random color scheme on page load
const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
applyColorScheme(randomScheme);

const { createApp } = Vue;

createApp({
    data() {
        return {
            cities: [
                { name: 'Oklahoma City', latitude: 35.4676, longitude: -97.5164 },
                { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
                { name: 'Nashville', latitude: 36.1627, longitude: -86.7816 }
            ],
            selectedCity: { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
            current: {},
            hourly: {},
            daily: {},
            loading: true,
            error: null,
            showTemperatureChart: false,
            selectedDate: null,
            temperatureChart: null,
            hourlyDataError: null,
            chartLoading: false,
            locationError: null,
            currentTimeIndex: null
        }
    },
    methods: {
        async fetchWeather() {
            try {
                this.loading = true;
                this.error = null;
                this.locationError = null;

                // Use Austin, TX as the default location
                this.selectedCity = { name: 'Austin', latitude: 30.2672, longitude: -97.7431 };

                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${this.selectedCity.latitude}&longitude=${this.selectedCity.longitude}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=7&timezone=auto`)
                const data = await response.json()
                
                this.current = data.current
                this.hourly = data.hourly
                this.daily = data.daily
                console.log('Weather data loaded:', data)
                this.loading = false
            } catch (err) {
                this.error = 'Failed to fetch weather data'
                this.loading = false
            }
        },
        celsiusToFahrenheit(celsius) {
            return (celsius * 9/5 + 32).toFixed(1)
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
                95: 'Thunderstorm'
            }
            return weatherCodes[code] || 'Unknown'
        },
        getWeatherImage(code) {
            // Group similar weather conditions
            if (code === 0 || code === 1) {
                return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=600&q=80'
            } else if (code === 2) {
                return 'https://images.unsplash.com/photo-1525490829609-d166ddb58678?w=600&q=80'
            } else if (code === 3) {
                return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&q=80'
            } else if (code === 45 || code === 48) {
                return 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=600&q=80'
            } else if (code >= 51 && code <= 55) {
                return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80'
            } else if (code >= 61 && code <= 65) {
                return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=600&q=80'
            } else if (code >= 71 && code <= 75) {
                return 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?w=600&q=80'
            } else if (code === 95) {
                return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=600&q=80'
            } else {
                return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&q=80' // Default cloudy image
            }
        },
        getWeatherIcon(code) {
            // Return weather icons based on code
            if (code === 0 || code === 1) {
                return '<i class="wi wi-day-sunny"></i>'; // Clear sky or mainly clear
            } else if (code === 2) {
                return '<i class="wi wi-day-cloudy"></i>'; // Partly cloudy
            } else if (code === 3) {
                return '<i class="wi wi-cloudy"></i>'; // Overcast
            } else if (code === 45 || code === 48) {
                return '<i class="wi wi-fog"></i>'; // Foggy or rime fog
            } else if (code >= 51 && code <= 55) {
                return '<i class="wi wi-sprinkle"></i>'; // Drizzle
            } else if (code >= 61 && code <= 65) {
                return '<i class="wi wi-rain"></i>'; // Rain
            } else if (code >= 71 && code <= 75) {
                return '<i class="wi wi-snow"></i>'; // Snow
            } else if (code === 95) {
                return '<i class="wi wi-thunderstorm"></i>'; // Thunderstorm
            } else {
                return '<i class="wi wi-cloudy"></i>'; // Default cloudy
            }
        },
        getWeatherClass(code) {
            // Return CSS class based on weather code
            if (code === 0 || code === 1) {
                return 'clear'; // Clear sky or mainly clear
            } else if (code === 2 || code === 3) {
                return 'cloudy'; // Partly cloudy or overcast
            } else if (code === 45 || code === 48) {
                return 'fog'; // Foggy or rime fog
            } else if (code >= 51 && code <= 65) {
                return 'rain'; // Drizzle and rain
            } else if (code >= 71 && code <= 75) {
                return 'snow'; // Snow
            } else if (code === 95) {
                return 'storm'; // Thunderstorm
            } else {
                return 'cloudy'; // Default
            }
        },
        formatHour(timestamp) {
            return new Date(timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        formatDate(timestamp) {
            const date = new Date(timestamp);
            // Add timezone offset to ensure correct date
            const offset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() + offset);
            return localDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        },
        showHourlyTemperature(date) {
            if (this.chartLoading) return;
            
            this.chartLoading = true;
            console.log('Showing hourly temperature for date:', date);
            this.selectedDate = date;
            this.showTemperatureChart = true;
            this.hourlyDataError = null;
            
            // Get the selected date in YYYY-MM-DD format with timezone adjustment
            const dateObj = new Date(date);
            const offset = dateObj.getTimezoneOffset() * 60000;
            const localDate = new Date(dateObj.getTime() + offset);
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            console.log('Formatted date to search for:', formattedDate);
            
            // Check if hourly data exists
            if (!this.hourly || !this.hourly.time || !this.hourly.temperature_2m) {
                console.error('Hourly data is missing or incomplete');
                this.hourlyDataError = 'Unable to load hourly temperature data';
                this.chartLoading = false;
                return;
            }
            
            // Filter hourly data for the selected date
            const hourlyData = [];
            const hourlyLabels = [];
            const temperatures = [];
            const rainChances = [];
            
            // Find hourly data that matches the selected date
            for (let i = 0; i < this.hourly.time.length; i++) {
                if (this.hourly.time[i].startsWith(formattedDate)) {
                    const tempF = this.celsiusToFahrenheit(this.hourly.temperature_2m[i]);
                    hourlyData.push({
                        time: this.hourly.time[i],
                        temperature: tempF
                    });
                    
                    // Format the hour for display
                    const hourDate = new Date(this.hourly.time[i]);
                    const hour = hourDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    hourlyLabels.push(hour);
                    temperatures.push(tempF);
                    rainChances.push(this.hourly.relative_humidity_2m[i]);

                    // Store the index of the current time if it's today
                    if (this.isToday() && new Date(this.hourly.time[i]).getTime() <= new Date().getTime()) {
                        this.currentTimeIndex = i;
                    }
                }
            }
            
            if (hourlyLabels.length === 0) {
                console.error('No hourly data found for date:', formattedDate);
                this.hourlyDataError = 'No hourly temperature data available for this date';
                this.chartLoading = false;
                return;
            }

            // Clean up existing chart
            if (this.temperatureChart) {
                try {
                    this.temperatureChart.destroy();
                    this.temperatureChart = null;
                } catch (e) {
                    console.log('Chart already destroyed');
                }
            }

            // Wait for DOM update and ensure canvas exists
            this.$nextTick(() => {
                // Add a small delay to ensure DOM is fully updated
                setTimeout(() => {
                    const ctx = document.getElementById('temperature-chart');
                    if (!ctx) {
                        console.error('Canvas element not found');
                        this.hourlyDataError = 'Unable to display chart (canvas element not found)';
                        this.chartLoading = false;
                        return;
                    }
                    
                    try {
                        const config = {
                            type: 'line',
                            data: {
                                labels: hourlyLabels,
                                datasets: [{
                                    label: 'Temperature (°F)',
                                    data: temperatures,
                                    borderColor: 'rgba(239, 68, 68, 1)',
                                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                    borderWidth: 2,
                                    tension: 0.3,
                                    fill: true,
                                    yAxisID: 'y'
                                },
                                {
                                    label: 'Humidity (%)',
                                    data: rainChances,
                                    borderColor: 'rgba(147, 197, 253, 1)',
                                    backgroundColor: 'rgba(147, 197, 253, 0.15)',
                                    borderWidth: 2,
                                    tension: 0.3,
                                    fill: true,
                                    yAxisID: 'y1'
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                animation: {
                                    onComplete: () => {
                                        this.chartLoading = false;
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: true,
                                        labels: {
                                            color: 'rgba(255, 255, 255, 0.7)'
                                        }
                                    },
                                    tooltip: {
                                        enabled: true,
                                        mode: 'index',
                                        intersect: false
                                    },
                                    annotation: {
                                        annotations: this.isToday() ? {
                                            currentTime: {
                                                type: 'line',
                                                xMin: this.currentTimeIndex,
                                                xMax: this.currentTimeIndex,
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                                borderWidth: 2,
                                                borderDash: [5, 5],
                                                label: {
                                                    content: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                                                    enabled: true,
                                                    position: 'top',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'rgba(255, 255, 255, 0.7)'
                                                }
                                            }
                                        } : {}
                                    }
                                },
                                scales: {
                                    x: {
                                        display: true,
                                        grid: {
                                            color: 'rgba(255, 255, 255, 0.1)'
                                        },
                                        ticks: {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            font: {
                                                size: 12
                                            },
                                            callback: function(value, index) {
                                                return hourlyLabels[index];
                                            }
                                        }
                                    },
                                    y: {
                                        display: true,
                                        position: 'left',
                                        grid: {
                                            color: 'rgba(255, 255, 255, 0.1)'
                                        },
                                        ticks: {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            font: {
                                                size: 12
                                            }
                                        }
                                    },
                                    y1: {
                                        display: true,
                                        position: 'right',
                                        grid: {
                                            display: false
                                        },
                                        ticks: {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            font: {
                                                size: 12
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        
                        // Create new chart
                        this.temperatureChart = new Chart(ctx, config);
                    } catch (err) {
                        console.error('Error creating chart:', err);
                        this.hourlyDataError = 'Error creating temperature chart: ' + err.message;
                        this.chartLoading = false;
                    }
                }, 100); // Small delay to ensure DOM is ready
            });
        },
        isToday() {
            if (!this.selectedDate) return false;
            const today = new Date();
            const selected = new Date(new Date(this.selectedDate).getTime() + (5 * 60 * 60 * 1000));
            
            // Adjust both dates to local timezone
            const todayStr = today.toLocaleDateString('en-US');
            const selectedStr = selected.toLocaleDateString('en-US');
            
            return todayStr === selectedStr;
        },
    },
    computed: {
        selectedDateFormatted() {
            return this.selectedDate ? this.formatDate(this.selectedDate) : '';
        }
    },
    mounted() {
        this.fetchWeather().then(() => {
            // Show today's temperature plot by default
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            this.showHourlyTemperature(todayStr);
        });
    }
}).mount('#app') 