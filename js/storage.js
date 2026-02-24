const CITY_KEY = 'cities'

export const getSavedCities = () => JSON.parse(localStorage.getItem(CITY_KEY)) || []

export const getLastSavedCity = () => {
    const cities = getSavedCities()
    if (cities.length === 0) return

    return cities[cities.length - 1].city
}

const getCityIndex = cityId => {
    const cities = getSavedCities()
    return cities.findIndex((citySearch) => Number(citySearch.id) === Number(cityId))
}

export const isCitySaved = cityId => getCityIndex(cityId) !== -1

export const saveOrDelCity = (id, city) => {
    const cities = getSavedCities()
    const cityIndex = getCityIndex(id)

    if (isCitySaved(id)) {
        cities.splice(cityIndex, 1)
    } else {
        cities.push({ id, city })
    }

    localStorage.setItem(CITY_KEY, JSON.stringify(cities))
}