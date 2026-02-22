const apiKey = '8887513993e5c2f18ca3f5bbf3aff560' // bruh...
const lang = 'ua'

const loadingIcon = document.querySelector('.loading')
const inputCity = document.getElementById('inputCity').value.trim()

let lat = 0
let lon = 0
export let weatherData = {}

export const getCityCoordsByName = async () => {
    if (inputCity === '') return
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&appid=${apiKey}`

    try {
        const responce = await fetch(apiUrl)

        if (!responce.ok)
            throw new Error(`Помилка відповіді від API міст: ${responce.status}`)

        const cityData = await responce.json()
        if (cityData.length === 0) throw new Error('місто не знайдене');

        lat = cityData[0].lat
        lon = cityData[0].lon
    } catch (error) {
        console.error(error)
        prevText.textContent = 'Упс, щось пішло не так'
    }
}

export const getWeatherData = async () => {
    loadingIcon.style.display = 'block'

    const apiUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${lang}`

    try {
        const responce = await fetch(apiUrl)

        if (!responce.ok)
            throw new Error(`Помилка відповіді від API погоди: ${responce.status}`)

        weatherData = await responce.json()
        loadingIcon.style.display = 'none'
    } catch (error) {
        console.error(error)
        prevText.textContent = 'Упс, щось пішло не так'
    }
}

// const fetchData = async city => {
//     mainWeatherContainer.style.visibility = 'hidden'
//     weatherDetailsContainer.style.visibility = 'hidden'

//     prevText.style.display = 'none'
//     loadingIcon.style.display = 'block'

//     try {
//         const urlCity = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
//         const responceCity = await fetch(urlCity)

//         if (!responceCity.ok) throw new Error('API з містами. ' + responceCity.status)

//         const dataCity = await responceCity.json()
//         if (dataCity.length === 0) throw new Error('місто не знайдене');

//         const lat = dataCity[0].lat
//         const lon = dataCity[0].lon

//         const url =
//             `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${lang}`
//         const responce = await fetch(url)
//         if (!responce.ok) throw new Error('API погоди. ' + responce.status)
//         const data = await responce.json()

//         loadingIcon.style.display = 'none'
//         mainWeatherContainer.style.visibility = 'unset'
//         weatherDetailsContainer.style.visibility = 'unset'

//         cityHeader.innerHTML = '<img src="assets/icons/location.png" class="locationImg"> ' + data.name
//         temp.textContent = Math.round(data.main.temp) + '°'
//         tempFeels.textContent = 'Відчувається як ' + Math.round(data.main.feels_like) + '°'

//         let weatherInfo = data.weather[0].description
//         weather.textContent = weatherInfo.replace(weatherInfo[0], weatherInfo[0].toUpperCase())

//         saveIcon.style.display = 'inline'
//         saveIcon.id = city
//         isCitySaved(city) ? saveIcon.src = 'assets/icons/saved.png' : saveIcon.src = 'assets/icons/unsaved.png'

//         if (data.weather[0].icon.at(-1) === 'n') {
//             weatherIcon.src = `assets/weather/${getIcon(data.weather[0].id)}_n.svg`
//         } else {
//             weatherIcon.src = `assets/weather/${getIcon(data.weather[0].id)}.svg`
//         }

//         const sunriseTime = new Date(data.sys.sunrise * 1000)
//         const sunsetTime = new Date(data.sys.sunset * 1000)

//         const weatherDetailsInfo = {
//             clouds: `${data.clouds.all}%`,
//             humidity: `${data.main.humidity}%`,
//             wind: `${Math.round(data.wind.speed)} м/c`,
//             sunrise: formatSunTime(sunriseTime.toLocaleString()),
//             sunset: formatSunTime(sunsetTime.toLocaleString())
//         }

//         let index = 0
//         for (const [key, value] of Object.entries(weatherDetailsInfo)) {
//             weatherDetails[index].textContent = value
//             index++
//         }
//     } catch (error) {
//         loadingIcon.style.display = 'none'
//         prevText.style.display = 'inline'

//         prevText.textContent = 'Помилка: ' + error
//         console.error('Помилка:', error)
//     }
// }