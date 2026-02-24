const apiKey = '8887513993e5c2f18ca3f5bbf3aff560' // bruh...
const lang = 'ua'

const getCityCoordsByName = async cityName => {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`

    const responce = await fetch(apiUrl)

    if (!responce.ok)
        throw new Error(`Помилка відповіді від API міст: ${responce.status}`)

    const cityData = await responce.json()
    if (cityData.length === 0) throw new Error('Місто не знайдене');

    return {
        lat: cityData[0].lat,
        lon: cityData[0].lon
    }
}

export const getWeatherData = async cityName => {
    const cityCoords = await getCityCoordsByName(cityName)
    const apiUrl =
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoords.lat}&lon=${cityCoords.lon}&units=metric&appid=${apiKey}&lang=${lang}`

    const responce = await fetch(apiUrl)

    if (!responce.ok)
        throw new Error(`Помилка відповіді від API погоди: ${responce.status}`)

    return await responce.json()
}