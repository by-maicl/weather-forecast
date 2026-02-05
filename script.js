const apiKey = '8887513993e5c2f18ca3f5bbf3aff560' // bruh...
const lang = 'ua'

const btnCity = document.getElementById('btnForm')
const cityHeader = document.getElementById('cityName')
const temp = document.getElementById('temp')
const tempFeels = document.getElementById('tempFeels')
const weather = document.getElementById('weather')
const loadingIcon = document.getElementById('loadingIcon')
const prevText = document.getElementById('prevText')
const weatherIcon = document.getElementById('weatherIcon')
const saveIcon = document.querySelector('.save-icon')
const listSavedCities = document.querySelector('.cities-list__saved')

async function fetchData(city) {
    temp.textContent = ''
    tempFeels.textContent = ''
    weather.textContent = ''
    cityHeader.innerHTML = ''
    weatherIcon.src = ''

    prevText.style.display = 'none'
    loadingIcon.style.display = 'inline'

    try {
        const urlCity = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
        const responceCity = await fetch(urlCity)

        if (!responceCity.ok) {
            throw new Error('API з містами. ' + responceCity.status)
        }

        const dataCity = await responceCity.json()

        if (dataCity.length === 0) {
            throw new Error('місто не знайдене');

        }

        const lat = dataCity[0].lat
        const lon = dataCity[0].lon

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${lang}`
        const responce = await fetch(url)

        if (!responce.ok) {
            throw new Error('API погоди. ' + responce.status)
        }

        const data = await responce.json()

        loadingIcon.style.display = 'none'

        saveIcon.style.display = 'inline'
        isCitySave(city) ? saveIcon.src = 'icons/saved.png' : saveIcon.src = 'icons/unsaved.png'

        cityHeader.innerHTML = '<img src="icons/location.png" class="locationImg"> ' + data.name
        temp.textContent = Math.round(data.main.temp) + '°'
        tempFeels.textContent = 'Відчувається як ' + Math.round(data.main.feels_like) + '°'

        let weatherInfo = data.weather[0].description
        weather.textContent = weatherInfo.replace(weatherInfo[0], weatherInfo[0].toUpperCase())

        if (data.weather[0].icon.at(-1) === 'n') {
            weatherIcon.src = `icons/weather/${getIcon(data.weather[0].id)}_n.svg`
        } else {
            weatherIcon.src = `icons/weather/${getIcon(data.weather[0].id)}.svg`
        }
    } catch (error) {
        loadingIcon.style.display = 'none'
        prevText.style.display = 'inline'

        prevText.textContent = 'Помилка: ' + error
        console.error('Помилка:', error)
    }
}

function getIcon(code) {
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

const saveOrDelCity = (citySave) => {
    const cities = JSON.parse(localStorage.getItem('cities')) || []
    const cityIndex = cities.findIndex((citySearch) => citySearch.city === citySave)

    if (cityIndex === -1) {
        cities.push({ city: citySave })
        saveIcon.src = 'icons/saved.png'
    } else {
        cities.splice(cityIndex, 1)
        saveIcon.src = 'icons/unsaved.png'
    }

    localStorage.setItem('cities', JSON.stringify(cities))
}

const isCitySave = (citySave) => {
    const cities = JSON.parse(localStorage.getItem('cities')) || []
    const cityIndex = cities.findIndex((citySearch) => citySearch.city === citySave)

    if (cityIndex === -1) {
        return false
    } else {
        return true
    }
}

const searchSavedCity = () => {
    const savedCities = document.querySelectorAll('.saved-city')
    for (const city of savedCities) {
        city.addEventListener('click', () => {
            fetchData(city.textContent)
        })
    }
}

const getSavedCities = () => {
    const cities = JSON.parse(localStorage.getItem('cities')) || []

    for (const city of cities) {
        const cityLi = document.createElement('li')
        cityLi.textContent = city.city
        cityLi.classList.add('saved-city')
        document.listSavedCities.appendChild(cityLi)
    }
}

btnCity.addEventListener("click", () => {
    const inputCity = document.getElementById('inputCity').value.trim()

    if (inputCity === '') {
        return
    }

    fetchData(inputCity)
})

getSavedCities()
searchSavedCity()
saveIcon.addEventListener("click", () => {
    saveOrDelCity(document.getElementById('inputCity').value.trim())
})