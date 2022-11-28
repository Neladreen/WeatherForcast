const KeyOpenCageData = "37035140d16941a69a2d2cbda9401ba2" ;
const KeyOpenWeatherMap = "d0fcc00c02efe5b8355fa57156f79f2b" ;

const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let placeObject = {
    city: '',
    coordonnees : {
        lat : '',
        long : '',
    },
    place : '',  
    time : ''
}

let weatherDay = {

}

//Recherche des coordonnées de la ville :
function API_lat_lng(cityName){
    let OCD = `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${KeyOpenCageData}&language=en`
    return fetch(OCD)
        .then(result => result.json())
        .then(data => {
            placeObject.coordonnees.lat = data.results[0].geometry.lat;
            placeObject.coordonnees.long = data.results[0].geometry.lng;
            placeObject.place = data.results[0].formatted
         })
        .catch(error => console.log(error))
}


//Recherche de la météo:
function API_meteo(latitude,longitude,dayNumber){
    let OWM = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${latitude}&lon=${longitude}&appid=${KeyOpenWeatherMap}`
    return fetch(OWM)
        .then(result => result.json())
        .then(data => {
            for(day=0; day < dayNumber ; day ++){
                weatherDay[day] = {}
                weatherDay[day].weather = data.daily[day].weather[0].main
                weatherDay[day].icon = data.daily[day].weather[0].icon
                weatherDay[day].temperature = parseInt(data.daily[day].temp.day)
            }
            if (data.current.weather[0].icon[2] === 'n'){
                placeObject.time = 'night'
            }
            else{
                placeObject.time = "day"
            }
             
        })
        .catch(error => console.log(error))
}

// Ce qui se lance au clic:
const searchButton = document.getElementById("search");
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    getWeather()
})


const searchSelect = document.getElementById("day__select");
searchSelect.addEventListener('click', (e) => {
    e.preventDefault();
    getWeather()
})


async function getWeather(){
    // On récupère les infos:
    placeObject.city = document.getElementById("city").value
    const numberOfDay = document.getElementById("day__select").value
    await API_lat_lng(placeObject.city)
    const placeHTML = `<h2>${placeObject.place}</h2>`
 
    result.style.display = "inline-block"

    let weatherHTML = ``;
    await API_meteo(placeObject.coordonnees.lat,placeObject.coordonnees.long, numberOfDay)
    document.body.style.backgroundImage = `var(--${placeObject.time}-background)`
    document.body.style.color = `var(--${placeObject.time}-color)`
    result.style.backgroundColor = `var(--${placeObject.time}-result-background)`
    const today = new Date()      

    // Pour chaque jour:
        for(let day=0; day<numberOfDay; day++){
         const dayOfWeek= (today.getDay()+day)%7
 
        // Inserer les infos:
        weatherHTML+=`<div>
            <h3>${week[dayOfWeek]}</h3>
            <img src="http://openweathermap.org/img/wn/${weatherDay[day].icon}@2x.png" alt="image of the ${weatherDay[day].weather}">    
            <p>${weatherDay[day].temperature}°C</p>
        </div>`      
    }
     
    // Affichage:
    resultCity.innerHTML = placeHTML
    resultWeather.innerHTML = weatherHTML 
    }

