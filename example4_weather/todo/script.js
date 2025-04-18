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
            locationError: null
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
        }
    },
    mounted() {
        this.fetchWeather();
    }
}).mount('#app') 