const currentDate = new Date();
const CWB_API_KEY ="CWB-CB520137-D9B3-419C-90C5-36034BA1BCB3";
const dateString = currentDate.toLocaleDateString("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// 判斷當前時段是day or night
function getTimePeriod() {
    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    if (currentHour >= 18 || currentHour < 6) {
        return "night";
    }else {
        return "day"; 
    }
}

function getWxIconSrc(time, num) {
    const arr = {
        day: {
            // wxType: [
            //     [[1],"static/day-sun.svg"],
            //     [[2,3],"static/day-cloud-or-sun.svg"],
            //     [[4,5,6,7],"static/cloud.svg"],
            //     [[8,9,10,11,12,13,14,29,30,31,32,37,38,39],"static/raining.svg"],
            //     [[15,16,17,18,33,34,35,36,41],"static/thunderstorm.svg"],
            //     [[19,20],"static/day-rain-afternoon.svg"],
            //     [[21,22],"static/day-thunderstorm-afternoon.svg"],
            //     [[23,42],"static/snow.svg"],
            //     [[24,25,26,27,28],"static/day-fog.svg"]
            // ]
            1: "index_image/day-sun.svg",
            2: "index_image/day-cloud-or-sun.svg",3: "index_image/day-cloud-or-sun.svg",
            4: "index_image/cloud.svg",5: "index_image/cloud.svg",6: "index_image/cloud.svg",7: "index_image/cloud.svg",
            8: "index_image/raining.svg",9: "index_image/raining.svg",10: "index_image/raining.svg",11: "index_image/raining.svg",12: "index_image/raining.svg",13: "index_image/raining.svg",14: "index_image/raining.svg",29: "index_image/raining.svg",30: "index_image/raining.svg",31: "index_image/raining.svg",32: "index_image/raining.svg",37: "index_image/raining.svg",38: "index_image/raining.svg",39: "index_image/raining.svg",
            15: "index_image/thunderstorm.svg",16: "index_image/thunderstorm.svg",17: "index_image/thunderstorm.svg",18: "index_image/thunderstorm.svg",33: "index_image/thunderstorm.svg",34: "index_image/thunderstorm.svg",35: "index_image/thunderstorm.svg",36: "index_image/thunderstorm.svg",41: "index_image/thunderstorm.svg",
            19: "index_image/day-rain-afternoon.svg",20: "index_image/day-rain-afternoon.svg",
            21: "index_image/day-thunderstorm-afternoon.svg",22: "index_image/day-thunderstorm-afternoon.svg",
            23: "index_image/snow.svg",42: "index_image/snow.svg",
            24: "index_image/day-fog.svg",25: "index_image/day-fog.svg",26: "index_image/day-fog.svg",27: "index_image/day-fog.svg",28: "static/day-fog.svg",
        },
        night: {
            // wxType: [
            //     [[1],"static/day-sun.svg"],
            //     [[2,3],"static/day-cloud-or-sun.svg"],
            //     [[4,5,6,7],"static/cloud.svg"],
            //     [[8,9,10,11,12,13,14,29,30,31,32,37,38,39],"static/raining.svg"],
            //     [[15,16,17,18,33,34,35,36,41],"static/thunderstorm.svg"],
            //     [[19,20],"static/day-rain-afternoon.svg"],
            //     [[21,22],"static/day-thunderstorm-afternoon.svg"],
            //     [[23,42],"static/snow.svg"],
            //     [[24,25,26,27,28],"static/day-fog.svg"]
            // ]
            1: "index_image/night-sun.svg",
            2: "index_image/night-cloud-or-sun.svg",3: "index_image/night-cloud-or-sun.svg",
            4: "index_image/cloud.svg",5: "index_image/cloud.svg",6: "index_image/cloud.svg",7: "index_image/cloud.svg",
            8: "index_image/raining.svg",9: "index_image/raining.svg",10: "index_image/raining.svg",11: "index_image/raining.svg",12: "index_image/raining.svg",13: "index_image/raining.svg",14: "index_image/raining.svg",29: "index_image/raining.svg",30: "index_image/raining.svg",31: "index_image/raining.svg",32: "index_image/raining.svg",37: "index_image/raining.svg",38: "index_image/raining.svg",39: "index_image/raining.svg",
            15: "index_image/thunderstorm.svg",16: "index_image/thunderstorm.svg",17: "index_image/thunderstorm.svg",18: "index_image/thunderstorm.svg",33: "index_image/thunderstorm.svg",34: "index_image/thunderstorm.svg",35: "index_image/thunderstorm.svg",36: "index_image/thunderstorm.svg",41: "index_image/thunderstorm.svg",
            19: "index_image/night-rain-afternoon.svg",20: "index_image/night-rain-afternoon.svg",
            21: "index_image/night-thunderstorm-afternoon.svg",22: "index_image/night-thunderstorm-afternoon.svg",
            23: "index_image/snow.svg",42: "index_image/snow.svg",
            24: "index_image/night-fog.svg",25: "index_image/night-fog.svg",26: "index_image/night-fog.svg",27: "index_image/night-fog.svg",28: "index_image/night-fog.svg",
        }
    }
    return arr[time][num];
    // for (let i = 0; i < arr[time].wxType.length; i++) {
    //     if (arr[time].wxType[i][0].includes(num)) {
    //         return arr[time].wxType[i][1];
    //     }
    // }
}

// 各縣市當前天氣資訊
let records=null;
fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization="+CWB_API_KEY).then((response)=>{
	return response.json();
}).then((data)=>{ 
	records=data.records;
    renderRaining();
});

function renderRaining(){
    // 現在時間
    const title = document.querySelector(".title");
    const indexDate = document.createElement("div");
    indexDate.textContent = dateString;
    title.appendChild(indexDate)

    const indexContainor = document.querySelector(".indexcontainor")
    for (let i=0;i<21;i++){
        const locationName = document.createElement("div");
        locationName.classList.add("locationName");
        locationName.textContent = records.location[i].locationName

        // Wx天氣現象
        const wxDiv = document.createElement("div");
        wxDiv.classList.add("wxDiv");
        wxDiv.textContent = records.location[i].weatherElement[0].time[0].parameter.parameterName

        // 天氣圖
        const weatherImage = document.createElement("div");
        weatherImage.classList.add("weatherImage");
        let time = getTimePeriod();
        let num = records.location[i].weatherElement[0].time[0].parameter.parameterValue;
        let src = getWxIconSrc(time, num);
        weatherImage.style.backgroundImage = `url(${src})`;

        // 最高溫到最低溫
        const temperatureRange = document.createElement("div");
        temperatureRange.classList.add("temperatureRange")
        const temperatureLow = records.location[i].weatherElement[2].time[0].parameter.parameterName+"°"
        const temperatureHigh = records.location[i].weatherElement[4].time[0].parameter.parameterName+"°"
        temperatureRange.textContent = temperatureLow+" - "+temperatureHigh;


        // CI舒適度
        const comfortTitle = document.createElement("div");
        comfortTitle.classList.add("comfortTitle");
        comfortTitle.textContent = records.location[i].weatherElement[3].time[0].parameter.parameterName

        // Pop降雨機率
        const popTitle = document.createElement("div");
        popTitle.classList.add("popTitle");
        const rainingIcon = document.createElement("img");
        rainingIcon.classList.add("rainingIcon");
        rainingIcon.setAttribute('src', 'index_image/umbrella.png');
        popTitle.appendChild(rainingIcon);

        const popNumner = document.createElement("span");
        popNumner.classList.add("popNumner");
        popNumner.textContent = records.location[i].weatherElement[1].time[0].parameter.parameterName+"%"
        popTitle.appendChild(popNumner)

        locationName.appendChild(wxDiv)
        locationName.appendChild(weatherImage)
        locationName.appendChild(comfortTitle)
        locationName.appendChild(temperatureRange)
        locationName.appendChild(popTitle)
        indexContainor.appendChild(locationName)
    }
}