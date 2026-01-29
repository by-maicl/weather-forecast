const apiKey = '8887513993e5c2f18ca3f5bbf3aff560'
const lang = 'ua'
const city = 'Kyiv'

const btnCity = document.getElementById('btnForm')
const cityHeader = document.getElementById('cityName')
const temp = document.getElementById('temp')
const tempFeels = document.getElementById('tempFeels')
const weather = document.getElementById('weather')
const loadingIcon = document.getElementById('loadingIcon')
const prevText = document.getElementById('prevText')

async function fetchData(city) {
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

        cityHeader.innerHTML = '<img src="icons/location.png" class="locationImg"> ' + data.name
        temp.textContent = Math.round(data.main.temp) + '°'
        tempFeels.textContent = 'Відчувається як ' + Math.round(data.main.feels_like) + '°'

        let weatherInfo = data.weather[0].description
        weather.textContent = weatherInfo.replace(weatherInfo[0], weatherInfo[0].toUpperCase())
    } catch (error) {
        loadingIcon.style.display = 'none'
        prevText.style.display = 'inline'

        prevText.style.color = '#8f0000'
        prevText.textContent = 'Помилка: ' + error
        console.error('Помилка:', error)
    }
}

btnCity.addEventListener("click", () => {
    const inputCity = document.getElementById('inputCity').value.trim()

    if (inputCity === '') {
        return
    }

    prevText.style.display = 'none'
    loadingIcon.style.display = 'inline'
    fetchData(inputCity)
})