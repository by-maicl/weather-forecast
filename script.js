const apiKey = '8887513993e5c2f18ca3f5bbf3aff560'
const lat = 50.4500336
const lon = 30.5241361
const lang = 'ua'
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${lang}`

const city = 'Kyiv'
const urlCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`

const cityName = document.getElementById('cityName')
const temp = document.getElementById('temp')

function fetchDataWeather() {
    fetch(url)
    .then(responce => responce.json())
    .then(data => {
        cityName.innerHTML = data.name
        temp.innerHTML = Math.round(data.main.temp)
    })
}

// function fetchDataCity() {
//     fetch(urlCity)
//     .then(responce => responce.json())
//     .then(data => {
//         const result = [data[0].lat, data[0].lon]
//         // return [data[0].lat, data[0].lon]
//         console.log()
//     })
// }

// let coords = fetchDataCity()
// console.log(coords)

fetchDataWeather()
