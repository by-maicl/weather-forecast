import { isCitySaved } from "./storage.js"

const mainWeatherContainer = document.querySelector('.main-weather')
const weatherDetailsContainer = document.querySelector('.weather-details')
const loadingIcon = document.querySelector('#loadingIcon')
const prevText = document.querySelector('#prevText')

const saveCitiesContainer = document.querySelector('.cities-list')
const listSavedCities = document.querySelector('.cities-list__saved')

const temp = document.querySelector('#temp')
const tempFeels = document.querySelector('#tempFeels')
const weatherDescription = document.querySelector('#weatherDescription')
const cityHeader = document.querySelector('#cityName')
const weatherIcon = document.querySelector('#weatherIcon')
export const saveIcon = document.querySelector('.save-icon')

const weatherDetails = document.querySelectorAll('.weather-details__info')

export const showLoading = () => {
    mainWeatherContainer.style.visibility = 'hidden'
    weatherDetailsContainer.style.visibility = 'hidden'
    prevText.style.display = 'none'
    loadingIcon.style.display = 'block'
}

export const hideLoading = (showContent = true) => {
    prevText.style.display = 'block'
    loadingIcon.style.display = 'none'
    if (showContent) {
        mainWeatherContainer.style.visibility = 'unset'
        weatherDetailsContainer.style.visibility = 'unset'
    }
}

export const showError = (text) => {
    mainWeatherContainer.style.visibility = 'hidden'
    weatherDetailsContainer.style.visibility = 'hidden'
    prevText.textContent = text
}

const getIcon = (code) => {
    switch (true) {
        case code >= 200 && code <= 232:
            return 'Thunderstorm'

        case (code >= 300 && code <= 321) ||
            (code >= 520 && code <= 531):
            return 'Drizzle'

        case code >= 500 && code <= 504:
            return 'Rain'

        case code === 511 ||
            (code >= 600 && code <= 622):
            return 'Snow'

        case code >= 701 && code <= 781:
            return 'Fog'

        case code === 800:
            return 'Clear'

        case code === 801:
            return 'Clouds'

        case code >= 802 && code <= 804:
            return 'Clouds_full'

        default:
            return 'Unknown'
    }
}

export const showSavedCities = (cities) => {
    listSavedCities.innerHTML = ''

    saveCitiesContainer.style.display =
        cities.length > 0 ? 'block' : 'none'

    for (const city of [...cities].reverse()) {
        const cityContainer = document.createElement('li')
        cityContainer.className = 'saved-city'
        cityContainer.textContent = city.city
        listSavedCities.append(cityContainer)
    }
}

export const showWeatherInfo = weatherData => {
    prevText.textContent = ''

    temp.textContent = `${Math.round(weatherData.main.temp)}°`
    tempFeels.textContent = `Відчувається як ${Math.round(weatherData.main.feels_like)}°`

    let description = weatherData.weather[0].description
    weatherDescription.textContent = description.replace(description[0], description[0].toUpperCase())

    cityHeader.innerHTML = `<img src="assets/icons/location.png" class="locationImg"> ${weatherData.name}`

    const weatherIconType = weatherData.weather[0].icon.at(-1)
    weatherIcon.src =
        weatherIconType === 'n'
            ? `assets/weather/${getIcon(weatherData.weather[0].id)}_n.svg`
            : `assets/weather/${getIcon(weatherData.weather[0].id)}.svg`
}

export const showSaveIcon = (cityId, city) => {
    saveIcon.style.display = 'inline'
    saveIcon.dataset.cityName = city
    saveIcon.dataset.cityId = cityId
    saveIcon.src =
        isCitySaved(cityId)
            ? 'assets/icons/saved.png'
            : 'assets/icons/unsaved.png'
}

const formatSunTime = time => {
    const timeSplit = time.split(', ')[1].split(':')
    return `${timeSplit[0]}:${timeSplit[1]}`
}

export const showWeatherDetails = (weatherData) => {
    const sunriseTime = new Date(weatherData.sys.sunrise * 1000)
    const sunsetTime = new Date(weatherData.sys.sunset * 1000)

    const weatherDetailsInfo = {
        clouds: `${weatherData.clouds.all}%`,
        humidity: `${weatherData.main.humidity}%`,
        wind: `${Math.round(weatherData.wind.speed)} м/c`,
        sunrise: formatSunTime(sunriseTime.toLocaleString()),
        sunset: formatSunTime(sunsetTime.toLocaleString())
    }

    weatherDetails.forEach((el, index) => {
        el.textContent = Object.values(weatherDetailsInfo)[index]
    })
}