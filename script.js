const apiKey = '8887513993e5c2f18ca3f5bbf3aff560' // bruh...
const lang = 'ua'

const btnCity = document.getElementById('btnForm')
const mainWeatherContainer = document.querySelector('.main-weather')
const weatherDetailsContainer = document.querySelector('.weather-details')
const cityHeader = document.getElementById('cityName')
const temp = document.getElementById('temp')
const tempFeels = document.getElementById('tempFeels')
const weather = document.getElementById('weather')
const loadingIcon = document.getElementById('loadingIcon')
const prevText = document.getElementById('prevText')
const weatherIcon = document.getElementById('weatherIcon')
const saveIcon = document.querySelector('.save-icon')
const listSavedCities = document.querySelector('.cities-list__saved')

const storageKey = 'cities'

const weatherDetails = document.querySelectorAll('.weather-details__info')

const fetchData = async city => {
    mainWeatherContainer.style.visibility = 'hidden'
    weatherDetailsContainer.style.visibility = 'hidden'

    prevText.style.display = 'none'
    loadingIcon.style.display = 'inline'

    try {
        const urlCity = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
        const responceCity = await fetch(urlCity)

        if (!responceCity.ok) throw new Error('API з містами. ' + responceCity.status)

        const dataCity = await responceCity.json()
        if (dataCity.length === 0) throw new Error('місто не знайдене');

        const lat = dataCity[0].lat
        const lon = dataCity[0].lon

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${lang}`
        const responce = await fetch(url)
        if (!responce.ok) throw new Error('API погоди. ' + responce.status)
        const data = await responce.json()

        loadingIcon.style.display = 'none'
        mainWeatherContainer.style.visibility = 'unset'
        weatherDetailsContainer.style.visibility = 'unset'

        cityHeader.innerHTML = '<img src="icons/location.png" class="locationImg"> ' + data.name
        temp.textContent = Math.round(data.main.temp) + '°'
        tempFeels.textContent = 'Відчувається як ' + Math.round(data.main.feels_like) + '°'

        let weatherInfo = data.weather[0].description
        weather.textContent = weatherInfo.replace(weatherInfo[0], weatherInfo[0].toUpperCase())

        saveIcon.style.display = 'inline'
        saveIcon.id = city
        isCitySaved(city) ? saveIcon.src = 'icons/saved.png' : saveIcon.src = 'icons/unsaved.png'

        if (data.weather[0].icon.at(-1) === 'n') {
            weatherIcon.src = `icons/weather/${getIcon(data.weather[0].id)}_n.svg`
        } else {
            weatherIcon.src = `icons/weather/${getIcon(data.weather[0].id)}.svg`
        }

        const sunriseTime = new Date(data.sys.sunrise * 1000)
        const sunsetTime = new Date(data.sys.sunset * 1000)

        const weatherDetailsInfo = {
            clouds: `${data.clouds.all}%`,
            humidity: `${data.main.humidity}%`,
            wind: `${Math.round(data.wind.speed)} м/c`,
            sunrise: formatSunTime(sunriseTime.toLocaleString()),
            sunset: formatSunTime(sunsetTime.toLocaleString())
        }

        let index = 0
        for (const [key, value] of Object.entries(weatherDetailsInfo)) {
            weatherDetails[index].textContent = value
            index++
        }
    } catch (error) {
        loadingIcon.style.display = 'none'
        prevText.style.display = 'inline'

        prevText.textContent = 'Помилка: ' + error
        console.error('Помилка:', error)
    }
}

const formatSunTime = time => {
    const timeSplit = time.split(', ')[1].split(':')
    return `${timeSplit[0]}:${timeSplit[1]}`
}

const getIcon = code => {
    if (code >= 200 && code <= 232) {
        return 'Thunderstorm'
    } else if ((code >= 300 && code <= 321)
        || (code >= 520 && code <= 531)) {
        return 'Drizzle'
    }
    else if (code >= 500 && code <= 504) {
        return 'Rain'
    } else if (code === 511 || (code >= 600 && code <= 622)) {
        return 'Snow'
    } else if (code >= 701 && code <= 781) {
        return 'Fog'
    } else if (code === 800) {
        return 'Clear'
    } else if (code === 801) {
        return 'Clouds'
    } else if (code >= 802 && code <= 804) {
        return 'Clouds_full'
    }
}

const saveCity = city => {
    const cities = JSON.parse(localStorage.getItem(storageKey)) || []
    const cityIndex = cities.findIndex((citySearch) => citySearch.city === city)

    isCitySaved(city)
        ? cities.splice(cityIndex, 1)
        : cities.push({ city: city })

    localStorage.setItem(storageKey, JSON.stringify(cities))
}

const isCitySaved = city => {
    const cities = JSON.parse(localStorage.getItem(storageKey)) || []
    const cityIndex = cities.findIndex((citySearch) => citySearch.city === city)

    return cityIndex === -1 ? false : true
}

const getSavedCities = () => {
    listSavedCities.innerHTML = ''
    const cities = JSON.parse(localStorage.getItem(storageKey)) || []

    if (cities.length > 0) {
        document.querySelector('.cities-list').style.display = 'block'
    } else {
        document.querySelector('.cities-list').style.display = 'none'
    }

    for (const city of cities.reverse()) {
        const cityContainer = document.createElement('li')
        cityContainer.className = 'saved-city'
        cityContainer.textContent = city.city
        listSavedCities.append(cityContainer)

        cityContainer.addEventListener('click', () => {
            fetchData(city.city)
        })
    }
}

const lastSavedCity = () => {
    const cities = JSON.parse(localStorage.getItem(storageKey)) || []
    return cities[cities.length - 1].city
}

btnCity.addEventListener("click", () => {
    const inputCity = document.getElementById('inputCity').value.trim()

    if (inputCity === '') return
    fetchData(inputCity)
})

saveIcon.addEventListener("click", () => {
    const inputCity = saveIcon.id

    saveCity(inputCity)
    isCitySaved(inputCity) ? saveIcon.src = 'icons/saved.png' : saveIcon.src = 'icons/unsaved.png'
    getSavedCities()
})

fetchData(lastSavedCity())
getSavedCities()