import { getWeatherData } from './api.js'
import { getSavedCities, saveOrDelCity, getLastSavedCity } from './storage.js'
import {
    saveIcon,
    hideLoading,
    showLoading,
    showWeatherInfo,
    showError,
    showSavedCities,
    showWeatherDetails,
    showSaveIcon
} from "./ui.js"

const inputCity = document.querySelector('#inputCity')
const inputCityBtn = document.querySelector('#btnForm')

const main = async cityName => {
    if (cityName === '') return

    let showContent = true
    try {
        showLoading()
        const weatherData = await getWeatherData(cityName)
        const cityId = weatherData.id

        showWeatherInfo(weatherData)
        showSaveIcon(cityId, cityName)
        showWeatherDetails(weatherData)
    } catch (error) {
        console.error(error)
        showError(error.message)
        showContent = false
    } finally {
        hideLoading(showContent)
    }
}

showSavedCities(getSavedCities())
const savedCitiesContainer = document.querySelector('.cities-list__saved')
savedCitiesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('saved-city')) {
        main(e.target.textContent)
        inputCity.value = ''
    }
})

inputCityBtn.addEventListener('click', () => main(inputCity.value.trim()))

saveIcon.addEventListener('click', () => {
    const cityName = saveIcon.dataset.cityName
    const cityId = saveIcon.dataset.cityId
    saveOrDelCity(cityId, cityName)
    showSaveIcon(cityId, cityName)
    showSavedCities(getSavedCities())
})

const lastSavedCity = getLastSavedCity()
if (lastSavedCity !== undefined) {
    main(lastSavedCity)
}