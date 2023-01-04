const line = document.getElementById("line");
const icon = document.getElementById("icon");
const windowWidth = window.innerWidth;
const rect = line.getBoundingClientRect();

getWeather();
showCurrentTime();

// Map from weather code to weather icon src
function getWxIconSrc(time,num) { // getWxTypeSrc(str:day|night,num)
    const arr = {
        day:{
            wxType: [
                [[1],"/img/day-sun.svg"],
                [[2,3,4,5,6,7],"/img/day-cloudy.svg"],
                [[8,9,10,12,13,19,20,29,31,37],"/img/day-cloudy-rain.svg"],
                [[11,14,30,32,38,39],"/img/rain.svg"],
                [[15,16,17,18,21,22,33,34,35,36,41],"/img/day-thunder-rain.svg"],
                [[23,42],"/img/day-snow.svg"],
                [[24,25,26,27,28],"/img/day-fog.svg"]
            ]
        },
        night:{
            wxType: [
                [[1],"/img/night-moon.svg"],
                [[2,3,4,5,6,7],"/img/night-cloudy.svg"],
                [[8,9,10,12,13,19,20,29,31,37],"/img/night-cloudy-rain.svg"],
                [[11,14,30,32,38,39],"/img/rain.svg"],
                [[15,16,17,18,21,22,33,34,35,36,41],"/img/night-thunder-rain.svg"],
                [[23,42],"/img/night-snow.svg"],
                [[24,25,26,27,28],"/img/night-fog.svg"]
            ]
        }
    }
    numberOfType = arr.day.wxType.length;
    for (let i = 0; i < numberOfType; i ++) {
        if (arr[time].wxType[i][0].includes(num)) {
            return arr[time].wxType[i][1]
        }
    }
}

// Move sun by user clicking
line.addEventListener("click", event => {
    const lineWidth = line.offsetWidth;
    const offset = event.offsetX;
    const newPosition = Math.floor(offset / (lineWidth / 3)) * (lineWidth / 3);
    icon.style.left = newPosition + "px";
});

// Get current time and show onto the page
function showCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() +1;
    const date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    const currentTime = `現在是${hours}點${minutes}分`;
    const currentDate = `${year}年${month}月${date}日`;

    const timeSpan = document.querySelector(".time");
    timeSpan.textContent = currentTime;

    const dateSpan = document.querySelector(".date");
    dateSpan.textContent = currentDate;
}

// Fetch to get weather and render the result onto the page
function getWeather() {
    const apiKey = "CWB-A3D31E92-A9C0-49A3-A368-F98481A37B7C"
    const weatherUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}`

    fetch(weatherUrl)
    .then(res => {return res.json();})
    .then(data => {
        if (data.success === "true") {
            // Set local variables
            const location = data.records.location;
            const numberOfCities = location.length;
            const dayOrNight = [];
            let period = 0;

            // View of ticks and set time periods
            const span = document.getElementsByClassName("tick");
            const defaultTime = location[0].weatherElement[0].time
            for (let i = 0; i < defaultTime.length; i ++) {
                const date = new Date(defaultTime[i].startTime);
                const tickDate = date.getDate();
                const tickMonth = date.getMonth() + 1;
                const tickHour = date.getHours();
                const tickTime = `${tickMonth}/${tickDate} ${tickHour}點`;
                span[i].textContent = tickTime;
                // Check is day or is night of three periods 
                if (tickHour < 6 || tickHour >= 18) {
                    dayOrNight.push("night");
                } else {
                    dayOrNight.push("day");
                }
            }
            // init
            changeData();

            // View of weather data
            function changeData() {
                const cities = document.getElementsByClassName("city");
                for (let i = 0; i < numberOfCities; i ++) {
                    cities[i].textContent = location[i].locationName;
                }
                for (let i = 0; i < numberOfCities; i ++) {
                    const img = document.querySelectorAll(".wx img");
                    img[i].title = location[i].weatherElement[0].time[period].parameter.parameterName;
                    img[i].alt = location[i].weatherElement[0].time[period].parameter.parameterName;
                    img[i].src = getWxIconSrc(dayOrNight[period], parseInt(location[i].weatherElement[0].time[period].parameter.parameterValue));
                }
                const rain = document.getElementsByClassName("rain");
                for (let i = 0; i < numberOfCities; i ++) {
                    rain[i].textContent = location[i].weatherElement[1].time[period].parameter.parameterName + "%";
                }
                // change icon on slider
                const icon = document.querySelector("#icon img");
                if (dayOrNight[period] === "day") {
                    icon.src = "/img/sun.png";
                }
                if (dayOrNight[period] === "night") {
                    icon.src = "/img/moon.svg";
                }
            }

            // Read tick
            line.addEventListener("click", event => {
                const lineWidth = line.offsetWidth;
                const offset = event.offsetX;
                const section = Math.floor((offset/lineWidth)* 3)
                if (section === 0) {
                    period = 0;
                }
                else if (section === 1) {
                    period = 1;
                }
                else if (section === 2 ) {
                    period = 2;
                }
                changeData();
            })
        }
    })
}