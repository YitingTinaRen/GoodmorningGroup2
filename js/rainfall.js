const CWB_API_KEY = "CWB-CB520137-D9B3-419C-90C5-36034BA1BCB3";

window.onload=function(){
    fetchPerdayPrecipitation();

}

function fetchPerdayPrecipitation(){
    const weatherUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0025-001?Authorization=${CWB_API_KEY}`
    fetch(weatherUrl,{
        method:"GET",
    }).then(response=>{
        return response.json()
    }).then(data=>{
        pickPerdayPrecipitationData(data);
    })
}

let attractionNameArray = [];
let attractionPrecipitationArray = [];
let numberOfAttraction="";
let dataDay="";
function pickPerdayPrecipitationData(data){ 
    let attractionIndexArray = [];
    dataDay=data.records.location[1].stationObsTimes.stationObsTime[data.records.location[1].stationObsTimes.stationObsTime.length-1].Date;
    // console.log(data.records.location[9].stationObsTimes.stationObsTime[3-1]);
    numberOfAttraction=(data.records.location).length;
    for(let i =0;i<numberOfAttraction;i++){
        attractionIndexArray.push(i);
        attractionNameArray.push(data.records.location[i].station.StationName);
        attractionPrecipitationArray.push(data.records.location[i].stationObsTimes.stationObsTime[data.records.location[0].stationObsTimes.stationObsTime.length-1].weatherElements.Precipitation);
    }
    createSearchItem(attractionIndexArray,attractionNameArray);
    // console.log(attractionPrecipitationArray);
    dealAttractionPrecipitationArray(attractionPrecipitationArray,attractionNameArray);
}

function createSearchItem(attractionIndexArray,attractionNameArray){
    const selectTitle = document.getElementById("selectTitle"); 
    for(let i = 0;i<attractionIndexArray.length;i++){ 
        let option = document.createElement("option"); 
        option.setAttribute("value",attractionIndexArray[i]);
        option.appendChild(document.createTextNode(attractionNameArray[i])); 
        selectTitle.appendChild(option);
    }
}

let averagePrecipitation=0;
function dealAttractionPrecipitationArray(attractionPrecipitationArray,attractionNameArray){
    let floatAttractionPrecipitationArray=[];
    let totalAttractionPrecipitation=0;
    for(let i=0;i<attractionPrecipitationArray.length;i++){
        if(attractionPrecipitationArray[i]=="X" || attractionPrecipitationArray[i]=="T"){
            floatAttractionPrecipitationArray.push(0);
            totalAttractionPrecipitation+=0;
        }else{
            floatAttractionPrecipitationArray.push(parseFloat(attractionPrecipitationArray[i]));
            totalAttractionPrecipitation+=parseFloat(attractionPrecipitationArray[i]);
        }  
    }
    // console.log(totalAttractionPrecipitation);
    averagePrecipitation=totalAttractionPrecipitation/attractionPrecipitationArray.length;
    // console.log(averagePrecipitation);
    createChart(floatAttractionPrecipitationArray,attractionNameArray);
    createChartCampare([0,0],"");
}





const optionElement = document.getElementById("selectTitle");
optionElement.addEventListener("change",contentShow); // ??????????????????????????????????????????????????????
function contentShow(event){
    let itemIndex=event.target.value;
    let dataForCompare=[];
    let attractionName=[];
    document.querySelector(".day_contain").textContent=dataDay;
    if(itemIndex=="--????????????--"){
        document.querySelector(".daily_rain_contain").textContent="--";
        return
    }
    if(attractionPrecipitationArray[itemIndex]=="T"){
        document.querySelector(".daily_rain_contain").textContent="??????0.1mm";
        document.querySelector(".daily_rain_contain").style.color="rgb(72, 72, 72)";
        dataForCompare=[0,averagePrecipitation];
        attractionName=attractionNameArray[itemIndex];
    }
    else if(attractionPrecipitationArray[itemIndex]=="X"){
        document.querySelector(".daily_rain_contain").textContent="???????????????????????????";
        document.querySelector(".daily_rain_contain").style.color="red";
        dataForCompare=[0,averagePrecipitation];
        attractionName=attractionNameArray[itemIndex];
    }else{
        document.querySelector(".daily_rain_contain").textContent=(String(attractionPrecipitationArray[itemIndex])+"mm");
        // attractionPrecipitation=attractionPrecipitationArray[itemIndex];
        document.querySelector(".daily_rain_contain").style.color="rgb(72, 72, 72)";
        // dealAttractionPrecipitation(attractionPrecipitation);
        dataForCompare=[attractionPrecipitationArray[itemIndex],averagePrecipitation];
        attractionName=attractionNameArray[itemIndex];
    }
    createChartCampare(dataForCompare,attractionName);
}


function createChart(floatAttractionPrecipitationArray,attractionNameArray){
    let chartStatus = Chart.getChart("myChart"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: attractionNameArray,
            datasets: [{
                label: '????????????????????????  ??????mm',
                data: floatAttractionPrecipitationArray,
                backgroundColor: [
                    '#9DD9D2',
                ],
                borderColor: [
                    '#9DD9D2',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: '?????????????????????????????????',
                    font: {
                            size: 23
                        }
                },
            },
        }
    });
}




function createChartCampare(dataForCompare,attractionName){
    let chartStatus = Chart.getChart("myChart_compare"); // <canvas> id
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    const ctx = document.getElementById('myChart_compare').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [attractionName+" ???????????????","??????????????????????????????"],
            datasets: [{
                label: ['????????????????????????  ??????mm'],
                data: dataForCompare,
                backgroundColor: [
                    '#9DD9D2',
                    '#F4D06F'
                ],
                borderColor: [
                    '#9DD9D2',
                    '#F4D06F'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: '??????????????????????????????????????????',
                    font: {
                            size: 23
                        }
                }
                                
            },
            
        }
    });



    
    //==========================

    // const myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         datasets: [{
    //             label: '????????????',
    //             data: [10, 50],
    //             // this dataset is drawn below
    //             order: 2
    //         }, {
    //             label: '?????????',
    //             data: [10, 50],
    //             type: 'line',
    //             // this dataset is drawn on top
    //             order: 1
    //         }],
    //         labels: ['??????', '????????????']
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,  
    //         plugins: {
    //             legend: {
    //                 labels: {
    //                     font: {
    //                         size: 20
    //                     }
    //                 }
    //             },
    //             title: {
    //                 display: true,
    //                 text: '??????????????????????????????????????????',
    //                 font: {
    //                         size: 30
    //                     }
    //             },
    //         }             
            
    //     }
    // });
}






// ==================   ??????????????????    =====================
// function reportWindowSize() {
//     let heightOutput = window.innerHeight;
//     let widthOutput = window.innerWidth;
//     // console.log(heightOutput);
//     console.log(widthOutput);
// }
// window.addEventListener("resize", reportWindowSize);
// // reportWindowSize()



// T ????????????????????????0.1mm???V?????????????????????
// "X" ?????????????????????????????????
// console.log(data.records.location[0].stationObsTimes.stationObsTime[0].weatherElements);







//=======================   ????????????????????????    ========================

// function dealAttractionPrecipitation(attractionPrecipitation){
//     attractionPrecipitation=parseInt(attractionPrecipitation);
//     if(attractionPrecipitation>=500){
//         console.log("????????????");
//         createChart(100);
//     }else if(attractionPrecipitation>=350){
//         console.log("?????????");
//         createChart(100);
//     }else if(attractionPrecipitation>=200){
//         console.log("??????");
//         createChart(100);
//     }else if(attractionPrecipitation>=80){
//         console.log("??????");
//         attractionPrecipitation=Math.sqrt(attractionPrecipitation)*10;
//         createChart(attractionPrecipitation);
//     }else{
//         attractionPrecipitation=Math.sqrt(attractionPrecipitation)*10;
//         createChart(attractionPrecipitation);
//     }
// }
